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
)

type AuthModel struct{
	UserID 	   bson.ObjectId `json:"userId" bson:"_userId"`
	PrivateKey string	 `json:"privateKey" bson:"privateKey"`
	Scope 	   string	 `json:"scope" bson:"scope"`
	TTL 	   time.Time	 `json:"ttl" bson:"ttl"`
	Created    time.Time	 `json:"create" bson:"created"`
}

//Validate user token
func ValidateToken(db *mgo.Database, token string, payload string) (string, bool){
	tokenBits := strings.Split(token, ":")

	if len(tokenBits) == 2 {
		if entry, isAvailable := getUserKey(db, tokenBits[0]); isAvailable {
			validHash := computeHmac256(payload, []byte(entry.PrivateKey))

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
		Key:        []string{"privateKey"},
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
	//Update the current key
	//@todo: Should changes the private key to avoid duplicated use or stolen key
	//@todo: update cache entry
	if entry, isAvailable := getUserKey(db, user.ID); isAvailable{
		entry.TTL = time.Now().Add(3600*time.Second)

		if err := c.Update(bson.M{"_userId": user.ID},
			bson.M{"$set": &entry}); err == nil {
			return entry.PrivateKey
		}else{
			return ""
		}
	}


	entry := &AuthModel{
		UserID:user.ID,
		PrivateKey: hex.EncodeToString(sha256.Sum256(rndb)),
		Scope: "full",//only supported
		TTL: time.Now().Add(3600*time.Second),
		Created: time.Now()}

	if err := c.Insert(entry); err == nil{
		return entry.PrivateKey
	}
	return ""
}

//Get user key
func getUserKey(db *mgo.Database, userID string) (AuthModel, bool){
	c := db.C(dbCollection)
	var entry *AuthModel

	if err := c.FindId(bson.ObjectIdHex(userID)).One(entry); err == nil{
		return entry, true
	}

	return entry, false
}