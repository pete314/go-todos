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
)

const (
	dbCollection = "user"
)

type User struct {
	ID        bson.ObjectId `json:"id" bson:"_id"`
	Email     string        `json:"email" bson:"email"`
	Password  string        `json:"password,omitempty" bson:"password"`
	Firstname string        `json:"firstname" bson:"firstname"`
	Surname   string        `json:"surname" bson:"surname"`
	Dob       string        `json:"dob" bson:"dob"`
	Created   time.Time     `json:"created" bson:"created,omitempty"`
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
			result.Password = "" // don't send the password hash
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
	pBytes, _ := bcrypt.GenerateFromPassword([]byte(u.Password), 10)

	index := mgo.Index{
		Key:        []string{"email"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	err := c.EnsureIndex(index)
	if err != nil {
		return &common.ErrorBody{Src: "API.USER.CREATE.DB", Code: 500, Desc: "Error while storing user, index"},
			false
	}

	u.ID = bson.NewObjectId()
	u.Password = string(pBytes[:])
	u.Created = time.Now()
	u.Updated = time.Now()

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
	q = c.Find(bson.M{"email": u.Email}).Select(bson.M{"_id": 1, "email": 1, "password": 1})

	if err := q.One(&foundUser); err == nil {
		if invalidHash := bcrypt.CompareHashAndPassword([]byte(foundUser.Password),
				[]byte(u.Password)); invalidHash == nil {
			return &common.SuccessBody{Success: true, Result: "v0.1/user/get/" + foundUser.ID.Hex()},
				true
		}
	}

	return &common.ErrorBody{Src: "API.USER.REQUEST.VALIDATE", Code: 404,
					Desc: "User not found, or invalid password"},
		false
}

//Delete user profile entry from database
func DeleteUser(db *mgo.Database, userId string) (interface{}, bool) {
	c := db.C(dbCollection)

	if err := c.Remove(bson.M{"_id": bson.ObjectIdHex(userId)}); err == nil {
		return &common.SuccessBody{Success: true, Result: true},
			true
	}

	return &common.ErrorBody{Src: "API.USER.REQUEST.VALIDATE", Code: 404,
		Desc: "User not found, did not delete user"},
		false
}

//Edit user fields
func EditUser(db *mgo.Database, uID string, f string, fv string) (interface{}, bool) {
	c := db.C(dbCollection)

	if err := c.Update(bson.M{"_id": bson.ObjectIdHex(uID)},
				bson.M{"$set": bson.M{f: fv, "updated": time.Now()}}); err == nil {
		return &common.SuccessBody{Success: true, Result: "v0.1/user/get/" + uID},
			true
	}

	return &common.ErrorBody{Src: "API.USER.REQUEST.VALIDATE", Code: 404,
		Desc: "User not found, did not delete user"},
		false
}

//Update all user fields
func UpdateUser(db *mgo.Database, u *User)(interface{}, bool){
	c := db.C(dbCollection)
	u.Updated = time.Now()

	if err := c.Update(bson.M{"_id": u.ID},
			bson.M{"$set": &u}); err == nil {
		return &common.SuccessBody{Success: true, Result: "v0.1/user/get/" + u.ID.Hex()},
			true

	}

	return &common.ErrorBody{Src: "API.USER.REQUEST.VALIDATE", Code: 404,
		Desc: "User not found, did not delete user"},
		false
}
