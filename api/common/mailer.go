//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.10.14.
//Description: Collection of mailing functions

package common

import(
	"gopkg.in/gomail.v2"
	"log"
	"os"
	"encoding/json"
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

func SendWelcomeEmail(ec *EmailContent) bool{
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
			return false
		}

		return true
	}else{
		log.Println("Could not load smtp config from config/")
		return false
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