//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.10.03.
//Description: Task model - holds base struct and database functions

package task

import (
	"gopkg.in/mgo.v2/bson"
	"time"
	"gopkg.in/mgo.v2"
	"../common"
	"net/http"
	"log"
)

const (
	dbCollection = "task"
)

type TaskModel struct{
	ID        bson.ObjectId `json:"id" bson:"_id"`
	OwnerID   bson.ObjectId	`json:"ownerId" bson:"_ownerId"`
	Name	  string        `json:"name,omitempty" bson:"name"`
	Content   string        `json:"content,omitempty" bson:"content"`
	Status    int           `json:"status" bson:"status"`
	Importance    int       `json:"importance" bson:"importance"`
	Until     string    	`json:"until" bson:"until,omitempty"`
	TTL       int     	`json:"ttl,omitempty" bson:"ttl,omitempty"`
	Created   time.Time     `json:"created" bson:"created,omitempty"`
	Updated   time.Time     `json:"updated" bson:"updated"`
}

//Get task(s)
func GetTask(db *mgo.Database, res *common.Resource, userId bson.ObjectId) (interface{}, bool) {
	c := db.C(dbCollection)
	var q *mgo.Query
	var result []*TaskModel

	if res.ID != "" {
		q = c.FindId(bson.ObjectIdHex(res.ID))
	}else{
		q = c.Find(bson.M{"_ownerId": userId})
	}


	if err := q.All(&result); err == nil {
		return &common.SuccessBody{Success: true, Result: &result},
			true
	}

	//@todo: introduce generalized logging
	return &common.ErrorBody{Code: 500, Src: "API.TASK.GET.DB", Desc: "Could not find results"},
		false
}

//Create new task
func CreateTask(db *mgo.Database, tm *TaskModel) (int, interface{}, bool) {
	c := db.C(dbCollection)

	//@todo: push to db init script
	index := mgo.Index{
		Key:        []string{"_ownerId","_id"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	err := c.EnsureIndex(index)
	if err != nil {
		return http.StatusBadRequest,
			&common.ErrorBody{Src: "API.Task.CREATE.DB", Code: 500, Desc: "Error while storing task, index"},
			false
	}

	tm.ID = bson.NewObjectId()
	tm.Created = time.Now()
	tm.Updated = time.Now()

	if err := c.Insert(tm); err == nil {
		return http.StatusAccepted,
			&common.SuccessBody{Success: true, Result: "v0.1/task/get/" + tm.ID.Hex()},
			true
	} else {
		log.Println(err)
		return http.StatusInternalServerError,
			&common.ErrorBody{Src: "API.TASK.CREATE.DB", Code: 500, Desc: "Error while storing task"},
			false
	}
}