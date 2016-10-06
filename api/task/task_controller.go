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
	"../user"
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
		w.Header().Add("Access-Control-Allow-Methods", "GET,PUT,PATCH,DELETE,OPTIONS")
		common.Respond(w, r, http.StatusOK, nil)
		return
	}
	// not found
	common.RespondHTTPErr(w, r, http.StatusNotFound,
		&common.ErrorBody{Src: "API.USER.ROUTER", Code:404, Desc:"Invalid http request on resource"})
}

//Get task detail
//@todo: add cache at this point (serialize entire response)
//@todo: introduce module cache keys
func handleTaskGet(w http.ResponseWriter, r *http.Request) {
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	u := common.GetVar(r, "user").(*user.User)

	if p.Action != "get" {
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			&common.ErrorBody{Src: "API.TASK.REQUEST.VALIDATION", Code: 400,
				Desc: "Invalid request type GET>>get"})
		return
	}

	if result, isSuccess := GetTask(db, p, u); isSuccess{
		common.Respond(w, r, http.StatusOK, &result)
	}else{
		common.RespondHTTPErr(w, r, http.StatusNotFound, &result)
	}
}

//Handles create task
func handleTaskPost(w http.ResponseWriter, r *http.Request) {

}

//Update all task fields
func handleTaskPut(w http.ResponseWriter, r *http.Request) {

}

//Edit single task field
func handleTaskPatch(w http.ResponseWriter, r *http.Request) {

}

//Delete a user task
func handleTaskDelete(w http.ResponseWriter, r *http.Request) {

}
