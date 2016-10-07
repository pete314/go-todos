//Author: Peter Nagy - https://github.com/pete314/go-todos
//Since: 2016.09.26.
//Description: The application entry point holding the main

package main

import (
	"flag"
	"log"
	"time"
	"github.com/gorilla/mux"
	"github.com/stretchr/graceful"
	"gopkg.in/mgo.v2"
	"./user"
	"./task"
)

func main(){
	var (
		addr  = flag.String("addr", ":8080", "endpoint address")
		mongo = flag.String("mongo", "localhost", "mongodb address")
		dbname    = flag.String("dbname", "todo-api", "database name")
	)
	log.Println("Dialing mongo", *mongo)
	db, err := mgo.Dial( *mongo )
	if err != nil {
		log.Fatalln("Failed to connect to mongo:", err)
	}
	defer db.Close()
	db.DB(*dbname)

	rtr := mux.NewRouter()
	//Load user module
	user.AddModuleRouter(rtr, db)
	//Load task module
	task.AddModuleRouter(rtr, db)

	log.Println("Starting web server on", *addr)
	graceful.Run(*addr, 1*time.Second, rtr)
	log.Println("Stopping...")

}
