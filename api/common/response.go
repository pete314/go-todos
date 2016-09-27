//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.09.27.
//Description: handle response parsing

package common

import (
	"encoding/json"
	"net/http"
)

func DecodeBody(r *http.Request, v interface{}) error {
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(v)
}
