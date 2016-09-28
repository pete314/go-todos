//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.09.27.
//Description: handle response parsing

package common

import (
	"encoding/json"
	"net/http"
)

//Holds the error http body structure
type ErrorBody struct {
	Src  string
	Code int
	Desc string
}

//Holds the success http body structure
type SuccessBody struct {
	Success bool
	Result  interface{}
}

//Serialize *Body struct into json
func SerializeJson(b interface{}) []byte{
	bodyBytes, _ := json.Marshal(b)
	return bodyBytes;
}

//Encode data into JSON
func EncodeBody(w http.ResponseWriter, r *http.Request, v interface{}) error {
	return json.NewEncoder(w).Encode(v)
}

//Create the http response with 200-OK
func Respond(w http.ResponseWriter, r *http.Request, status int, data interface{}) {
	w.WriteHeader(status)
	if data != nil{
		EncodeBody(w, r, data)
	}
}

//Create http error response without body
func RespondHTTPErr(w http.ResponseWriter, r *http.Request, status int, s ...interface{}) {
	Respond(w, r, status, s)
}

