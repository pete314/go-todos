//Author: Peter Nagy - https://github.com/pete314/go-todos
//Since: 2016.09.26.
//Description: Path resolver for api

package common

import (
	"net/http"
	"gopkg.in/mgo.v2"
	"strings"
)
//Resource map for current request
type Resource struct {
	ID 	string
	Action	string
	Param 	string
}

//Add default headers to response
// net/http
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
func AddAuthentication(db *mgo.Session, fn http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		db := GetVar(r, "db").(*mgo.Database)

		//Do not validate login or register request
		if !strings.Contains(r.RequestURI, string("user/login")) &&
			!strings.Contains(r.RequestURI, string("user/new")) &&
			strings.Compare(r.Method, "OPTIONS") != 0 {

			if userId, isValid := isValidRequest(db, r.Header.Get("Authorization")); !isValid {
				RespondHTTPErr(w, r, http.StatusUnauthorized,
					ErrorBody{Src:"API.AUTHENTICATION", Code: 401, Desc: "Invalid authentication"})
				return
			} else {
				SetVar(r, "user", userId)
			}

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
//@todo: should user hmac as well
func isValidRequest(db *mgo.Database, accessKey string) (interface{}, bool) {
	if accessKey != ""{
		return ValidateToken(db, accessKey)
	}else{
		return AuthModel{}, false
	}
}