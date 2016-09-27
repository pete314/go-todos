//Author: Peter Nagy - https://github.com/pete314/go-todos
//Since: 2016.09.26.
//Description: Handles request parsing

package common

import (
	"encoding/json"
	"fmt"
	"net/http"
)

//Encode data into JSON
func EncodeBody(w http.ResponseWriter, r *http.Request, v interface{}) error {
	return json.NewEncoder(w).Encode(v)
}

//Create the http response with 200-OK
func Respond(w http.ResponseWriter, r *http.Request,
	status int, data interface{},
) {
	w.WriteHeader(status)
	if data != nil {
		EncodeBody(w, r, data)
	}
}

//Create http error response with http status code with message
func RespondErr(w http.ResponseWriter, r *http.Request,
	status int, args ...interface{},
) {
	Respond(w, r, status, map[string]interface{}{
		"error": map[string]interface{}{
			"message": fmt.Sprint(args...),
		},
	})
}

//Create http error response without body
func RespondHTTPErr(w http.ResponseWriter, r *http.Request, status int) {
	RespondErr(w, r, status, http.StatusText(status))
}
