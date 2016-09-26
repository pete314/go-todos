//Author: Peter Nagy - https://github.com/pete314/
//Since: 2016.09.26.
//Description: User module controller

package user

import (
	//"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"net/http"
	"../common"
)

type User struct {
	ID      bson.ObjectId  `bson:"_id" json:"id"`
	Title   string         `json:"title" bson:"title"`
	Options []string       `json:"options"`
	Results map[string]int `json:"results,omitempty"`
}

func HandleUser(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case "GET":
		handleUserGet(w, r)
		return
	case "POST":
		handleUserPost(w, r)
		return
	case "DELETE":
		handleUserDelete(w, r)
		return
	case "OPTIONS":
		w.Header().Add("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS")
		common.Respond(w, r, http.StatusOK, nil)
		return
	}
	// not found
	common.RespondHTTPErr(w, r, http.StatusNotFound)
}

func handleUserGet(w http.ResponseWriter, r *http.Request) {

}
func handleUserPost(w http.ResponseWriter, r *http.Request) {

}

func handleUserDelete(w http.ResponseWriter, r *http.Request) {

}
