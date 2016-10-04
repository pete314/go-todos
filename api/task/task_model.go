//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.10.03.
//Description: Task model - holds base struct and database functions

package task

import (
	"gopkg.in/mgo.v2/bson"
	"time"
	"gopkg.in/mgo.v2"
	"../common"
	"../user"
)

const (
	dbCollection = "task"
)

type Task struct{
	ID        bson.ObjectId `json:"id" bson:"_id"`
	OwnerID   bson.ObjectId `json:"ownerId" bson:"_ownerId"`
	Name	  string        `json:"name,omitempty" bson:"name"`
	Content   string        `json:"content,omitempty" bson:"content"`
	Status    int           `json:"status" bson:"status"`
	Importance    int       `json:"importance" bson:"importance"`
	Until     time.Time     `json:"until" bson:"until,omitempty"`
	TTL       time.Time     `json:"ttl,omitempty" bson:"ttl,omitempty"`
	Created   time.Time     `json:"created" bson:"created,omitempty"`
	Updated   time.Time     `json:"updated" bson:"updated"`
}

//Get task(s)
func GetTask(db *mgo.Database, res *common.Resource, user *user.User) (interface{}, bool) {
	c := db.C(dbCollection)
	var q *mgo.Query
	var result []*Task

	if res.ID != "" {
		q = c.FindId(bson.ObjectIdHex(res.ID))
	}else{
		q = c.Find(bson.M{"_ownerId": user.ID})
	}


	if err := q.All(&result); err == nil {
		return &common.SuccessBody{Success: true, Result: &result},
			true
	}

	//@todo: introduce generalized logging
	return &common.ErrorBody{Code: 500, Src: "API.TASK.GET.DB", Desc: "Could not find results"},
		false
}