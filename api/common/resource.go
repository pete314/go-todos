//Author: Peter Nagy - https://github.com/pete314/go-todos
//Since: 2016.09.26.
//Description: Path resolver for api

package common

import (
	"strings"
	"net/http"
	"gopkg.in/mgo.v2"
)

//Holds the uri path separator char
const PathSeparator = "/"

//Resource map for current request
type Resource struct {
	Version string
	Resource string
	ID 	string
	Action	string
}

//Parse request uri into Resource struct
func ParseRequestUri( uriString string ) *Resource{
	version, resource, id, action := "", "", "", ""
	uriString = strings.Trim(uriString, PathSeparator)
	uriBits := strings.Split(uriString, PathSeparator)

	if len(uriBits) >= 2 && len(uriBits) < 5{
		version = uriBits[0]
		resource = uriBits[1]

		//Check and @todo: validate UUID && action
		//probably set up an application wide map
		if len(uriBits) >= 3 {
			if len(uriBits[2]) < 6 {
				action = uriBits[2]
			}else {
				id = uriBits[2]
			}
		}

		if len(uriBits) == 4 {
			if len(uriBits[3]) < 6 {
				action = uriBits[3]
			}else {
				id = uriBits[3]
			}
		}
	}

	return &Resource{Version: version, Resource: resource, ID: id, Action: action}
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