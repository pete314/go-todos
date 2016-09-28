//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.09.27.
//Description: User model - holds base struct and database functions

package user

import (
	"../common"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"time"
	"fmt"
)

const (
	dbCollection = "user"
)

type User struct {
	ID        bson.ObjectId `json:"id" bson:"_id"`
	Email     string        `json:"email" bson:"email"`
	Passwordh string        `json:"password" bson:"password"`
	Firstname string        `json:"firstname" bson:"firstname"`
	Surname   string        `json:"surname" bson:"surname"`
	Dob       string        `json:"dob" bson:"dob"`
	Created   time.Time     `json:"created" bson:"created"`
	Updated   time.Time     `json:"updated" bson:"updated"`
}

//Get the user
//returns the response body and true on success
func GetUser(db *mgo.Database, res *common.Resource) (interface{}, bool) {
	c := db.C(dbCollection)
	var q *mgo.Query
	var result *User

	if res.ID != "" {
		// get specific user
		q = c.FindId(bson.ObjectIdHex(res.ID))

		if err := q.One(&result); err == nil {

			return &common.SuccessBody{Success: true, Result: &result},
				true
		}
	}

	//@todo: introduce generalized logging
	return &common.ErrorBody{Code: 500, Src: "API.USER.GET.DB", Desc: "Could not find results"},
		false
}

//Create new user account
func CreateUser(db *mgo.Database, res *common.Resource, u *User) (interface{}, bool) {
	c := db.C(dbCollection)
	pBytes, _ := bcrypt.GenerateFromPassword([]byte(u.Passwordh), 10)

	u.ID = bson.NewObjectId()
	u.Passwordh = string(pBytes[:len(pBytes)-1])
	u.Created = bson.Now()
	u.Updated = bson.Now()

	if err := c.Insert(u); err == nil {
		return &common.SuccessBody{Success: true, Result: "v0.1/user/get/" + u.ID.Hex()},
			true
	} else {
		return &common.ErrorBody{Src: "API.USER.CREATE.DB", Code: 500, Desc: "Error while storing user"},
			false
	}
}

//Validate user login attempt
func ValidateUser(db *mgo.Database, res *common.Resource, u *User) (interface{}, bool) {
	c := db.C(dbCollection)
	var q *mgo.Query
	var foundUser *User

	// get specific user
	q = c.Find(bson.M{"email": u.Email})

	if err := q.One(&foundUser); err == nil {
		fmt.Println(&foundUser.Passwordh)
		if invalidHash := bcrypt.CompareHashAndPassword([]byte(foundUser.Passwordh),
				[]byte(u.Passwordh)); invalidHash == nil {
			return &common.SuccessBody{Success: true, Result: &foundUser},
				true
		}else{
			fmt.Println(invalidHash)
		}
	}

	return &common.ErrorBody{Src: "API.USER.REQUEST.VALIDATE", Code: 404,
					Desc: "User not found, or invalid password"},
		false
}
