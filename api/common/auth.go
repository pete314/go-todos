//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.10.04.
//Description: Authentication functions for API

package common

import (
	"time"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"crypto/sha256"
	"crypto/hmac"
	"math/rand"
	"encoding/hex"
	"encoding/base64"
	"strings"
	"log"
)

//@todo: should validate the client id as well
const (
	dbCollection = "api_auth"
	clientSecret = "9190f10a35c99be0fc6522b7eaa14edbdf7e40e347057f00909bd20a98a82b44"
	clientId = "76256f9f-0486-401b-a242-a6f52a77784b"
)

type AuthModel struct{
	TokenID	   string	 `json:"tokenId" bson:"_tokenId"`
	UserID 	   string 	 `json:"userId" bson:"_userId"`
	Scope 	   int		 `json:"scope" bson:"scope"`
	TTL 	   time.Time	 `json:"ttl" bson:"ttl"`
	Created    time.Time	 `json:"create" bson:"created"`
}

type OauthModel struct{
	ID 		bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	Email 		string `json:"email" bson:"email"`
	Password	string `json:"password" bson:"password,omitempty"`
	ClientId 	string `json:"client_id" bson:"client_id"`
	ClientSecret 	string `json:"client_secret" bson:"client_secret"`
	GrantType	string `json:"grant_type" bson:"grant_type"`
	DevUserId  	string `json:"devUserId,omitempty" bson:"devUserId,omitempty"`
	Scope 		int `json:"scope,omitempty" bson:"scope,omitempty"`
	Created  time.Time `json:"created,omitempty" bson:"created"`
}

//Validate bearer
//@todo: should check for expires after ui is ready
//@todo: should auto clean mongodb with expires
func ValidateToken(db *mgo.Database, token string) (interface{}, bool){
	tokenBits := strings.Split(strings.TrimSpace(token), " ")
	if len(tokenBits) == 2 && strings.Compare(tokenBits[0], string("Bearer")) == 0{
		if entry, isAvailable := getToken(db, tokenBits[1]); isAvailable {
			return entry, true
		}
	}

	return nil, false
}

//Validate user token hmac
func ValidateTokenHmac(db *mgo.Database, token string, payload string) (string, bool){
	tokenBits := strings.Split(token, ":")

	if len(tokenBits) == 2 {
		if entry, isAvailable := getToken(db, tokenBits[0]); isAvailable {
			validHash := computeHmac256(payload, []byte(entry.TokenID))

			return  tokenBits[0], 0 == strings.Compare(strings.ToLower(validHash), strings.ToLower(tokenBits[1]))
		}
	}

	return "", false
}

//Compute the hmac of the payload or url
func computeHmac256(payload string, secret []byte) string {
	h := hmac.New(sha256.New, secret)
	h.Write([]byte(payload))
	return string(base64.StdEncoding.EncodeToString(h.Sum(nil))[:])
}

func CreateUserToken(db *mgo.Database, userId bson.ObjectId, co *OauthModel) string{
	if strings.Compare(co.ClientId, clientId) != 0 || strings.Compare(co.ClientSecret, clientSecret) != 0||
		strings.Compare(co.GrantType, string("client_credentials")) != 0{
		log.Println(co)
		return ""
	}

	c := db.C(dbCollection)
	rndb := make([]byte, 32)
	rand.Read(rndb)
	hash := sha256.New()
	hash.Write(rndb)

	//@todo: push this into db initlization script
	index := mgo.Index{
		Key:        []string{"_tokenId", "_userId"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	tokenTTL := mgo.Index{
		Key:         []string{"created"},
		Unique:      false,
		DropDups:    false,
		Background:  true,
		ExpireAfter: 1 * 60} //3600 sec

	if err := c.EnsureIndex(tokenTTL); err != nil {
		log.Println(err)
		return ""
	}

	if err := c.EnsureIndex(index); err != nil {
		log.Println(err)
		return ""
	}

	entry := &AuthModel{
		UserID: userId.Hex(),
		TokenID: hex.EncodeToString(hash.Sum(nil)),
		Scope: 0,//only supported
		TTL: time.Now().Add(3600*time.Second),
		Created: time.Now()}

	if err := c.Insert(entry); err == nil{
		return entry.TokenID
	}else{
		log.Println("Token insertion error:", err)
	}
	return ""
}

//Get token
func getToken(db *mgo.Database, tokenId string) (*AuthModel, bool){
	c := db.C(dbCollection)
	var entry *AuthModel

	if err := c.Find(bson.M{"_tokenId": tokenId}).One(&entry); err == nil{
		return entry, true
	}

	return entry, false
}