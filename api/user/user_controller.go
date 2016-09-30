//Author: Peter Nagy - https://github.com/pete314/
//Since: 2016.09.26.
//Description: User module controller

package user

import (
	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
	"../common"
	"net/http"
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
				common.AddAuthentication(userController))))))

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
	if p.Action != "get" {
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
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	var u *User
	var result interface{}
	isSuccess := false

	if err := common.DecodeBody(r, &u); err != nil {
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			&common.ErrorBody{Src: "API.USER.REQUEST.PARSE", Code: 400, Desc: "Failed to parse request body"})
		return
	}

	//Handle create account
	//@todo: try generalize field validation
	if p.Action == "new" &&
		u.Passwordh != "" &&
		u.Dob != "" &&
		u.Email != "" &&
		u.Firstname != "" &&
		u.Surname != "" {
		result, isSuccess = CreateUser(db, p, u)
	} else if p.Action == "login" &&
		u.Passwordh != "" &&
		u.Email != "" &&
		u.Firstname == "" &&
		u.Surname == "" &&
		u.Dob == ""{
		result, isSuccess = ValidateUser(db, p, u)
	}else{
		result = &common.ErrorBody{Src:"API.USER.REQUEST.VALIDATE", Code: 400, Desc:"Invalid request body"}
	}

	if !isSuccess {
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			result)
		return
	}

	common.Respond(w, r, http.StatusCreated, result)
}

func handleUserPut(w http.ResponseWriter, r *http.Request) {

}

func handleUserPatch(w http.ResponseWriter, r *http.Request) {
	//validate the key sent with request
	//validate
}

//Handle user delete account
//@todo: this should be validated(email confirmation) and scheduled only, not direct delete
func handleUserDelete(w http.ResponseWriter, r *http.Request) {
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	var result interface{}
	isSuccess := false

	if result, isSuccess = DeleteUser(db, p.ID); !isSuccess{
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			result)
	}else{
		common.Respond(w, r, http.StatusCreated, result)
	}
}
