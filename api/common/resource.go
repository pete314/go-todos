//Author: Peter Nagy - https://github.com/pete314/go-todos
//Since: 2016.09.26.
//Description: Path resolver for api

package common

import (
	"net/http"
	"gopkg.in/mgo.v2"
)
//Resource map for current request
type Resource struct {
	ID 	string
	Action	string
	Param 	string
}

//Add default headers to response
func AddDeafultHeaders(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Server", "go-todo-api/v0.1")
		w.Header().Set("Content-Type", "application/json")
		fn(w, r)
	}
}

//Add CORS (OPTIONS) support for Ajax, AngularJS requests
func AddCORS(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Expose-Headers", "Location")
		fn(w, r)
	}
}

//Add shared variable support for request
func AddVars(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		OpenVars(r)
		defer CloseVars(r)
		fn(w, r)
	}
}

//Add request authentication support
func AddAuthentication(fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if !isValidRequest(r.Header.Get("Authorization")) {
			//respondErr(w, r, http.StatusUnauthorized, "invalid API key")
			return
		}
		fn(w, r)
	}
}

//Add database access to request
func WithDataAccess(db *mgo.Session, fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		thisDb := db.Copy()
		defer thisDb.Close()
		SetVar(r, "db", thisDb.DB("todo-api"))
		fn(w, r)
	}
}

//Validate request based on Authorization token
//@todo: implement JWT - use
func isValidRequest(accessKey string) bool {
	return true;
}