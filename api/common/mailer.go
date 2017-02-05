//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.10.14.
//Description: Collection of mailing functions

package common

import(
	"gopkg.in/gomail.v2"
	"log"
	"os"
	"encoding/json"
	"gopkg.in/mgo.v2"
)

const(
	senderHeader = "Joe Sergio <segios.gmit@gmail.com>"
)

type EmailContent struct{
	ToName 	  string
	ToAddress string
	Subject   string
	Body 	  string
}

type SMPTConfig struct{
	Server string
	Port int
	Username string
	Password string
}

type ContactModel struct{
	Subject string `json:"subject"`
	Content string `json:"content"`
}

//Send email to single receiver
//@todo: Config should come from cache
func SendMail(ec *EmailContent) bool{
	if conf, ok := loadSMTPConfig(); ok {
		m := gomail.NewMessage()
		m.SetHeader("From", senderHeader)
		m.SetHeader("Reply-To", senderHeader)
		m.SetHeader("To", ec.ToName + "<" + ec.ToAddress + ">")
		m.SetHeader("Subject", ec.Subject)
		m.SetBody("text/plain", "Hello !")

		d := gomail.NewDialer(conf.Server, conf.Port, conf.Username, conf.Password)

		if err := d.DialAndSend(m); err != nil {
			log.Println(err)
			return false
		}

		return true
	}else{
		log.Println("Could not load smtp config from config/")
		return false
	}
}

func SendWelcomeEmail(ec *EmailContent) (interface{}, bool){
	if conf, ok := loadSMTPConfig(); ok {
		m := gomail.NewMessage()
		m.SetHeader("From", senderHeader)
		m.SetHeader("Reply-To", senderHeader)
		m.SetHeader("To", ec.ToName + "<" + ec.ToAddress + ">")
		m.SetHeader("Subject", ec.Subject)
		m.SetBody("text/plain", ec.Body)

		d := gomail.NewDialer(conf.Server, conf.Port, conf.Username, conf.Password)

		if err := d.DialAndSend(m); err != nil {
			log.Println(err)
			return nil, false
		}

		return &SuccessBody{Success: true, Result:true},
			true
	}else{
		log.Println("Could not load smtp config from config/")

		return &ErrorBody{Src: "API.UTIL.REQUEST.VALIDATE", Code: 404,
			Desc: "Could not send contact email"},
			false
	}
}

func SendContactEmail(ec *ContactModel, am *AuthModel, db *mgo.Database) (interface{}, bool){
	c := db.C(dbCollection)
	var q *mgo.Query
	u := &struct{
		firstname string
		email string
	}{}
	q = c.FindId(am.UserID)

	if err := q.One(&u); err != nil {
		log.Println("Could not find user for sending email ", err)
		return &ErrorBody{Src: "API.UTIL.REQUEST.VALIDATE", Code: 404,
			Desc: "Could not send contact email"},
			false
	}

	if conf, ok := loadSMTPConfig(); ok {
		m := gomail.NewMessage()
		m.SetHeader("From", senderHeader)
		m.SetHeader("Reply-To", senderHeader)
		m.SetHeader("To", u.firstname + "<" + u.email + ">")
		m.SetHeader("Subject", ec.Subject)
		m.SetBody("text/plain", ec.Subject)

		//Should send an email to client at the time
		d := gomail.NewDialer(conf.Server, conf.Port, conf.Username, conf.Password)

		if err := d.DialAndSend(m); err != nil {
			log.Println(err)
			return nil, false
		}

		return &SuccessBody{Success: true, Result:true},
			true
	}else{
		log.Println("Could not load smtp config from config/")
		return &ErrorBody{Src: "API.UTIL.REQUEST.VALIDATE", Code: 404,
			Desc: "Could not send contact email"},
			false
	}
}

//Load config file
func loadSMTPConfig() (SMPTConfig, bool){
	currPath, _ := os.Getwd()
	file, e:= os.Open(currPath+ "/var/www/config/smtp.local.json")
	if e != nil{
		log.Println(e)
	}
	decoder := json.NewDecoder(file)
	configuration := SMPTConfig{}
	err := decoder.Decode(&configuration)
	if err != nil {
		log.Println(err, file)
		return SMPTConfig{}, false
	}else{
		return configuration, true
	}
}