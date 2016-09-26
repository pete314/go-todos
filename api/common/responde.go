//Author: Peter Nagy - https://github.com/pete314/go-todos
//Since: 2016.09.26.
//Description:

package common

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func DecodeBody(r *http.Request, v interface{}) error {
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(v)
}
func EncodeBody(w http.ResponseWriter, r *http.Request, v interface{}) error {
	return json.NewEncoder(w).Encode(v)
}

func Respond(w http.ResponseWriter, r *http.Request,
	status int, data interface{},
) {
	w.WriteHeader(status)
	if data != nil {
		encodeBody(w, r, data)
	}
}

func RespondErr(w http.ResponseWriter, r *http.Request,
	status int, args ...interface{},
) {
	respond(w, r, status, map[string]interface{}{
		"error": map[string]interface{}{
			"message": fmt.Sprint(args...),
		},
	})
}
func RespondHTTPErr(w http.ResponseWriter, r *http.Request,
	status int,
) {
	respondErr(w, r, status, http.StatusText(status))
}
