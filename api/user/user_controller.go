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
	common.RespondHTTPErr(w, r, http.StatusNotFound)
}

//Get user detail
func handleUserGet(w http.ResponseWriter, r *http.Request) {
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	result := GetUser(db, p)
	common.Respond(w, r, http.StatusOK, &result)
}

func handleUserPost(w http.ResponseWriter, r *http.Request) {

}

func handleUserPut(w http.ResponseWriter, r *http.Request) {

}

func handleUserPatch(w http.ResponseWriter, r *http.Request) {

}

func handleUserDelete(w http.ResponseWriter, r *http.Request) {

}
