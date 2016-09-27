//Author: Peter Nagy - https://github.com/pete314/go-todos
//Since: 2016.09.26.
//Description: The application entry point holding the main

package main

import (
	"flag"
	"log"
	"net/http"
	"time"
	"github.com/stretchr/graceful"
	"gopkg.in/mgo.v2"
)

func main(){
	var (
		addr  = flag.String("addr", ":8080", "endpoint address")
		mongo = flag.String("mongo", "localhost", "mongodb address")
	)
	log.Println("Dialing mongo", *mongo)
	db, err := mgo.Dial(*mongo)
	if err != nil {
		log.Fatalln("Failed to connect to mongo:", err)
	}
	defer db.Close()
	mux := http.NewServeMux()

	log.Println("Starting web server on", *addr)
	graceful.Run(*addr, 1*time.Second, mux)
	log.Println("Stopping...")

}
