//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.10.14.
//Description: Collection of mailing functions

package common

import(
	"gopkg.in/gomail.v2"
	"io"
	"fmt"
)

const(
	senderHeader = "Todo team <gotodos@gcraic.com>"
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

func SendMail(ec *EmailContent, template string) bool{
	m := gomail.NewMessage()
	m.SetHeader("From", senderHeader)
	m.SetHeader("Reply-To", senderHeader)
	m.SetHeader("To", ec.ToName + "<"+ec.ToAddress+">")
	m.SetHeader("Subject", ec.Subject)
	m.SetBody("text/plain", "Hello!")

	s := gomail.SendFunc(func(from string, to []string, msg io.WriterTo) error {
		// Implements you email-sending function, for example by calling
		// an API, or running postfix, etc.
		fmt.Println("From:", from)
		fmt.Println("To:", to)
		return nil
	})

	if err := gomail.Send(s, m); err != nil {
		panic(err)
	}

	return true
}


func loadSMTPConfig() (SMPTConfig, bool){

}