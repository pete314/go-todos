//Author: Peter Nagy - https://github.com/pete314/go-todos
//Since: 2016.09.26.
//Description: Handles request parsing

package common

import (
	"encoding/json"
	"net/http"
)


//Parse request uri into Resource struct
func ParseRequestUri( uriParts map[string]string ) *Resource{
	id := getMapValue(uriParts, "id")
	action := getMapValue(uriParts, "action")
	param := getMapValue(uriParts, "param")

	return &Resource{ID: id, Action: action, Param: param}
}

//Get value of map or "" if not exist
func getMapValue(m map[string]string, keyName string) string{
	if val, ok := m[keyName]; ok{
		return val
	}else{
		return ""
	}
}

func DecodeBody(r *http.Request, v interface{}) error {
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(v)
}
