//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.09.27.
//Description: User model - holds base struct and database functions

package user

import (
	"gopkg.in/mgo.v2/bson"
	"gopkg.in/mgo.v2"
	"../common"
)

type User struct {
	ID      bson.ObjectId  `json:"id" bson:"_id"`
	Email       string     `json:"email" bson:"email"`
	Passwordh   string     `json:"passwordh" bson:"passwordh"`
	Firstname   string     `json:"firstname" bson:"firstname"`
	Surname     string     `json:"surname" bson:"surname"`
	Dob         string     `json:"dob" bson:"dob"`
	Created     string     `json:"created" bson:"created"`
	Updated     string     `json:"updated" bson:"updated"`
}

//Get the user
func GetUser(db *mgo.Database, res *common.Resource) interface{} {
	c := db.C("user")
	var q *mgo.Query
	var result []*User
	var body interface{}

	if res.ID != "" {
		// get specific user
		q = c.FindId(bson.ObjectIdHex(res.ID))
	}

	if err := q.All(&result); err != nil {
		//@todo: introduce genearalized logging
		body = &common.ErrorBody{Code:500, Src: "API.USER.GET.DB", Desc: "Could not find results"}
	}else{
		body = &common.SuccessBody{Success:true, Result: &result}
	}

	return body
}