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
//@todo: remove return of password
//@todo: should serialize response
//@todo: create general error listener
func GetUser(db *mgo.Database, res *common.Resource) *User{
	c := db.C("user")
	var q *mgo.Query
	if res.ID != "" {
		// get specific user
		q = c.FindId(bson.ObjectIdHex(res.ID))
	} else {
		// get all users
		q = c.Find(nil)
	}
	var result []*User
	if err := q.All(&result); err != nil {
		return nil
	}

	return result
}