//Author: Peter Nagy - https://github.com/pete314/go-todos
//Since: 2016.09.26.
//Description: Path resolver for api

package common

import "strings"

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
