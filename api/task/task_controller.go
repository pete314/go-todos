//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.10.03.
//Description: Task module controller

package task

import (
	//valid "github.com/asaskevich/govalidator"
	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
	"net/http"
	"../common"
	"log"
)

//Module controller constants
const (
	basePath  = "/v0.1/task"
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
		common.AddAuthentication(db, taskController))))))

	mainRouter.Handle(routeRegex, rtrTmp)
}

//Controller function for request action routing
func taskController(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		handleTaskGet(w, r)
		return
	case "POST":
		handleTaskPost(w, r)
		return
	case "PUT":
		handleTaskPut(w, r)
		return
	case "PATCH":
		handleTaskPatch(w, r)
		return
	case "DELETE":
		handleTaskDelete(w, r)
		return
	case "OPTIONS":
		w.Header().Add("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS")
		common.Respond(w, r, http.StatusOK, nil)
		return
	}
	// not found
	common.RespondHTTPErr(w, r, http.StatusNotFound,
		&common.ErrorBody{Src: "API.TASK.ROUTER", Code:404, Desc:"Invalid http request on resource"})
}

//Get task detail
//@todo: add cache at this point (serialize entire response)
//@todo: introduce module cache keys
func handleTaskGet(w http.ResponseWriter, r *http.Request) {
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	u := common.GetVar(r, "user").(*common.AuthModel)

	if p.Action != "get" {
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			&common.ErrorBody{Src: "API.TASK.REQUEST.VALIDATION", Code: 400,
				Desc: "Invalid request type GET>>get"})
		return
	}

	if result, isSuccess := GetTask(db, p, u.UserID); isSuccess{
		common.Respond(w, r, http.StatusOK, &result)
	}else{
		common.RespondHTTPErr(w, r, http.StatusNotFound, &result)
	}
}

//Handles create task
func handleTaskPost(w http.ResponseWriter, r *http.Request) {
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	user := common.GetVar(r, "user").(*common.AuthModel)
	var httpStatus int
	var responseBody interface{}
	isSuccess := false
	var taskBody *TaskModel

	if err := common.DecodeBody(r, &taskBody); err != nil {
		log.Println(err)
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			&common.ErrorBody{Src: "API.USER.REQUEST.PARSE", Code: 400, Desc: "Failed to parse request body"})
	}

	//Handle create account
	if p.Action == "new" {
		taskBody.OwnerID = user.UserID;
		httpStatus, responseBody, isSuccess = CreateTask(db, taskBody)
	} else{
		httpStatus = http.StatusBadRequest
		responseBody = &common.ErrorBody{Src:"API.TASK.REQUEST.VALIDATE", Code: 400, Desc:"Invalid request body for creating task"}
	}

	if !isSuccess {
		common.RespondHTTPErr(w, r,httpStatus, responseBody)
		return
	}

	common.Respond(w, r, httpStatus, responseBody)
}

//Update all task fields
func handleTaskPut(w http.ResponseWriter, r *http.Request) {

}

//Edit single task field
func handleTaskPatch(w http.ResponseWriter, r *http.Request) {

}

//Delete a user task
func handleTaskDelete(w http.ResponseWriter, r *http.Request) {
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	var result interface{}
	isSuccess := false
	user := common.GetVar(r, "user").(*common.AuthModel)

	if result, isSuccess = DeleteTask(db, p.ID, user.UserID); !isSuccess{
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			result)
	}else{
		common.Respond(w, r, http.StatusCreated, result)
	}
}
