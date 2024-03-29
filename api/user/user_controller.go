//Author: Peter Nagy - https://github.com/pete314/
//Since: 2016.09.26.
//Description: User module controller

package user

import (
	valid "github.com/asaskevich/govalidator"
	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
	"../common"
	"net/http"
	"gopkg.in/mgo.v2/bson"
	"log"
	"golang.org/x/crypto/bcrypt"
	"strings"
)

//Module controller constants
const (
	basePath  = "/v0.1/user"
	actionSub = "/{action:[a-z]+}"
	idSub = "/{id:[0-9a-fA-F]+}"
	fieldSub = "/{param:[a-z]+}"
)


//Add module routes to main router
func AddModuleRouter(mainRouter *mux.Router, db *mgo.Session){
	addRoute(basePath + actionSub, mainRouter, db);
	addRoute(basePath + actionSub + idSub, mainRouter, db);
	addRoute(basePath + actionSub + idSub + fieldSub, mainRouter, db);
}

//Add sub routes with regex to main router
func addRoute(routeRegex string, mainRouter *mux.Router, db *mgo.Session){
	rtrTmp := mux.NewRouter()
	rtrTmp.HandleFunc(routeRegex, common.AddDeafultHeaders(common.AddCORS(common.AddVars(common.WithDataAccess(db,
				common.AddAuthentication(db, userController))))))

	mainRouter.Handle(routeRegex, rtrTmp)
}

//Controller function for request action routing
func userController(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		handleUserGet(w, r)
		return
	case "POST":
		handleUserPost(w, r)
		return
	case "PUT":
		handleUserPut(w, r)
		return
	case "PATCH":
		handleUserPatch(w, r)
		return
	case "DELETE":
		handleUserDelete(w, r)
		return
	case "OPTIONS":
		w.Header().Add("Access-Control-Allow-Methods", "GET,PUT,PATCH,DELETE,OPTIONS")
		common.Respond(w, r, http.StatusOK, nil)
		return
	}
	// not found
	common.RespondHTTPErr(w, r, http.StatusNotFound,
			&common.ErrorBody{Src: "API.USER.ROUTER", Code:404, Desc:"Invalid http request on resource"})
}

//Get user detail
//@todo: add cache at this point (serialize entire response)
//@todo: introduce module cache keys
func handleUserGet(w http.ResponseWriter, r *http.Request) {
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	user := common.GetVar(r, "user").(*common.AuthModel)

	if p.Action != "get" || strings.Compare(user.UserID.Hex(), p.ID) != 0{
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			&common.ErrorBody{Src: "API.USER.REQUEST.VALIDATION", Code: 400,
				Desc: "Invalid request type GET>>get"})
		return
	}

	if result, isSuccess := GetUser(db, p); isSuccess{
		common.Respond(w, r, http.StatusOK, &result)
	}else{
		common.RespondHTTPErr(w, r, http.StatusNotFound, &result)
	}
}

//Handles create account and login
func handleUserPost(w http.ResponseWriter, r *http.Request) {
	p := common.ParseRequestUri(mux.Vars(r))
	var httpStatus int
	var responseBody interface{}
	isSuccess := false

	//Handle create account
	//@todo: try generalize field validation
	if p.Action == "new" {
		httpStatus, responseBody, isSuccess = handleUserReg(r)
	} else if p.Action == "login"{
		httpStatus, responseBody, isSuccess = handleUserLogin(r)
	}else{
		httpStatus = http.StatusBadRequest
		responseBody = &common.ErrorBody{Src:"API.USER.REQUEST.VALIDATE", Code: 400, Desc:"Invalid request body"}
	}

	if !isSuccess {
		common.RespondHTTPErr(w, r,httpStatus, responseBody)
		return
	}

	common.Respond(w, r, httpStatus, responseBody)
}

//Handle user registration
func handleUserReg(r *http.Request) (int, interface{}, bool){
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	var u *User

	if err := common.DecodeBody(r, &u); err != nil {
		log.Println(err)
		return http.StatusBadRequest,
			&common.ErrorBody{Src: "API.USER.REQUEST.PARSE", Code: 400, Desc: "Failed to parse request body"},
			false
	}

	//@todo: refactor
	if u.Password != "" && len(u.Password) > 5 &&
		u.Dob != "" &&
		u.Email != "" && valid.IsEmail(u.Email) &&
		u.Firstname != "" &&
		u.Surname != "" {

		return CreateUser(db, p, u)
	}else{
		return http.StatusBadRequest,
			&common.ErrorBody{Src:"API.USER.REQUEST.VALIDATE", Code: 400, Desc:"Invalid request body"},
			false
	}
}

//Handle user login
func handleUserLogin(r *http.Request) (int, interface{}, bool){
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	var o *common.OauthModel

	if err := common.DecodeBody(r, &o); err != nil {
		log.Println(err)
		return http.StatusBadRequest,
			&common.ErrorBody{Src: "API.USER.REQUEST.PARSE", Code: 400, Desc: "Failed to parse request body"},
			false
	}

	//@todo: refactor
	if o.Password != "" &&
		o.Email != "" && valid.IsEmail(o.Email) &&
		o.Password != "" &&
		o.ClientId != "" &&
		o.ClientSecret != "" &&
		o.GrantType != ""{
		return ValidateUser(db, p, o)
	}else{
		return http.StatusBadRequest,
			&common.ErrorBody{Src:"API.USER.REQUEST.VALIDATE", Code: 400, Desc:"Invalid request body"},
			false
	}
}


//Update all user fields
func handleUserPut(w http.ResponseWriter, r *http.Request) {
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	uAuth := common.GetVar(r, "user").(*common.AuthModel)
	var u *User

	if err := common.DecodeBody(r, &u); err != nil {
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			&common.ErrorBody{Src: "API.USER.REQUEST.PARSE", Code: http.StatusBadRequest, Desc: "Failed to parse request body"})
		return
	}

	//Password field is removed as it is pushed to the patch
	if p.Action == "update" && p.ID != "" && strings.Compare(uAuth.UserID.Hex(), p.ID) == 0 &&
		u.Dob != "" &&
		u.Email != "" && valid.IsEmail(u.Email) &&
		u.Firstname != "" &&
		u.Surname != "" {
			u.ID = bson.ObjectIdHex(p.ID)

			if result, isSuccess := UpdateUser(db, u); isSuccess{
				common.Respond(w, r, http.StatusAccepted, &result)
			}else{
				common.RespondHTTPErr(w, r, http.StatusBadRequest, &result)
			}
			return
	}

	common.RespondHTTPErr(w, r, http.StatusBadRequest,
		&common.ErrorBody{Src:"API.USER.REQUEST.VALIDATE", Code: 400, Desc:"Invalid request body"})
}

//User patch can update single field (used for update input field js(onFocusLost))
func handleUserPatch(w http.ResponseWriter, r *http.Request) {
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	uAuth := common.GetVar(r, "user").(*common.AuthModel)
	var u *User

	if err := common.DecodeBody(r, &u); err != nil {
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			&common.ErrorBody{Src: "API.USER.REQUEST.PARSE", Code: http.StatusBadRequest, Desc: "Failed to parse request body"})
		return
	}

	vField, vValue, isValid := checkFiledValue(u, p.Param)
	if isValid && strings.Compare(uAuth.UserID.Hex(), p.ID) == 0{
		if result, isSuccess := EditUser(db, p.ID, vField, vValue); isSuccess{
			common.Respond(w, r, http.StatusAccepted, &result)
		}else{
			common.RespondHTTPErr(w, r, http.StatusBadRequest, &result)
		}
		return
	}

	common.RespondHTTPErr(w, r, http.StatusBadRequest,
		&common.ErrorBody{Src: "API.USER.REQUEST.VALIDATION", Code: http.StatusBadRequest, Desc: "Validation error"})
	return
}

//Check fields parsed from body
func checkFiledValue(u *User, f string) (string, string, bool){
	switch f{
	case "password":
		if u.Password != "" && len(u.Password) > 5{
			pBytes , _ := bcrypt.GenerateFromPassword([]byte(u.Password), 10)
			return "password", string(pBytes[:]), true
		}
	case "email":
		if valid.IsEmail(u.Email){
			return "email", u.Email, true
		}
	case "dob":
		if u.Dob != "" {
			return "dob", u.Dob, true
		}
	case "fistname":
		if u.Firstname != "" {
			return "firstname", u.Firstname, true
		}
	case "surname":
		if u.Surname != "" {
			return "surname", u.Surname, true
		}
	}

	return "", "", false
}

//Handle user delete account
//@todo: this should be validated(email confirmation) and scheduled only, not direct delete
func handleUserDelete(w http.ResponseWriter, r *http.Request) {
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	uAuth := common.GetVar(r, "user").(*common.AuthModel)
	var result interface{}
	isSuccess := false

	if result, isSuccess = DeleteUser(db, p.ID); !isSuccess || strings.Compare(uAuth.UserID.Hex(), p.ID) != 0{
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			result)
	}else{
		common.Respond(w, r, http.StatusCreated, result)
	}
}
