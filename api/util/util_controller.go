//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.10.14.
//Description: Util controller

package util

import (
	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2"
	"../common"
	"net/http"
	"log"
)

//Module controller constants
const (
	basePath  = "/v0.1/util"
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
		common.AddAuthentication(db, utilController))))))

	mainRouter.Handle(routeRegex, rtrTmp)
}

//Controller function for request action routing
func utilController(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "POST":
		handleUtilPost(w, r)
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

//Handle util POST
func handleUtilPost(w http.ResponseWriter, r *http.Request){
	db := common.GetVar(r, "db").(*mgo.Database)
	p := common.ParseRequestUri(mux.Vars(r))
	user := common.GetVar(r, "user").(*common.AuthModel)
	var cm *common.ContactModel


	if err := common.DecodeBody(r, &cm); err != nil {
		log.Println(err)
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			&common.ErrorBody{Src: "API.UTIL.REQUEST.PARSE", Code: 400, Desc: "Failed to parse request body"})

		return

	}
	if p.Action != "contact"{
		common.RespondHTTPErr(w, r, http.StatusBadRequest,
			&common.ErrorBody{Src: "API.UTIL.REQUEST.VALIDATION", Code: 400,
				Desc: "Invalid request type CONTACT"})
		return
	}

	if result, isSuccess := common.SendContactEmail(cm, user, db); isSuccess{
		common.Respond(w, r, http.StatusOK, &result)
	}else{
		common.RespondHTTPErr(w, r, http.StatusNotFound, &result)
	}
}