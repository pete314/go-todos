//Author: Peter Nagy - https://github.com/pete314
//Since: 2016.10.04.
//Description: Authentication functions for API

package common

import (
	"time"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
	"../user"
	"crypto/sha256"
	"crypto/hmac"
	"math/rand"
	"encoding/hex"
	"encoding/base64"
	"strings"
)

const (
	dbCollection = "api_auth"
	clientSecret = "9190f10a35c99be0fc6522b7eaa14edbdf7e40e347057f00909bd20a98a82b44"
	clientId = "76256f9f-0486-401b-a242-a6f52a77784b"
)

type AuthModel struct{
	TokenID	   string	 `json:"tokenId" bson:"_tokenId"`
	UserID 	   bson.ObjectId `json:"userId" bson:"_userId"`
	Scope 	   int		 `json:"scope" bson:"scope"`
	TTL 	   time.Time	 `json:"ttl" bson:"ttl"`
	Created    time.Time	 `json:"create" bson:"created"`
}

type OauthModel struct{
	ID 		bson.ObjectId `json:"id,omitempty" bson:"_id,omitempty"`
	UserID 		bson.ObjectId `json:"ttl" bson:"ttl"`
	UserPassword	string `json:"userPassword" bson:"userPassword,omitempty"`
	ClientId 	string `json:"clientId" bson:"clientId"`
	ClientSecret 	string `json:"clientSecret" bson:"clientSecret"`
	DevUserId  	string `json:"devUserId" bson:"devUserId"`
	Scope 		int `json:"scope" bson:"scope"`
	Created  time.Time `json:"created" bson:"created"`
}

func ValidateToken(db *mgo.Database, token string, oauthmodel *OauthModel) (interface{}, bool){
	tokenBits := strings.Split(strings.TrimSpace(token), " ")
	if len(tokenBits) == 2 && strings.Compare(tokenBits[0], "Bearer"){
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
func computeHmac256(payload string, secret string) string {
	key := []byte(secret)
	h := hmac.New(sha256.New, key)
	h.Write([]byte(payload))
	return base64.StdEncoding.EncodeToString(h.Sum(nil))
}

func CreateUserToken(db *mgo.Database, user *user.User) string{
	c := db.C(dbCollection)
	var rndb [32]byte
	rand.Read(rndb)


	index := mgo.Index{
		Key:        []string{"_tokenId", "_userId"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}
	err := c.EnsureIndex(index)
	if err != nil {
		//@todo: introduce logging
		return ""
	}

	entry := &AuthModel{
		UserID: user.ID,
		TokenID: hex.EncodeToString(sha256.Sum256(rndb)),
		Scope: "full",//only supported
		TTL: time.Now().Add(3600*time.Second),
		Created: time.Now()}

	if err := c.Insert(entry); err == nil{
		return entry.TokenID
	}
	return ""
}

//Get token
func getToken(db *mgo.Database, tokenId string) (AuthModel, bool){
	c := db.C(dbCollection)
	var entry *AuthModel

	if err := c.FindId(bson.ObjectIdHex(tokenId)).One(entry); err == nil{
		return entry, true
	}

	return entry, false
}