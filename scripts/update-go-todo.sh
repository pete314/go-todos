## Author: Peter Nagy - https://peternagy.ie
## Since: 30/09/2016
## Description: The following script updates the application on Ubuntu 16.04
## Dependencies: apache2 (or nginx) golang git supervisor

printf "Start update process \n==============\n \n"
service supervisor stop

#Constants
REPO_NAME="/go-todos"
PROJECT_ROOT="/usr/local/src/go-todo"
BINARY_DIR="/bin"
PKG_DIR="/pkg"
LOG_DIR="/logs"
BACKUP_DIR="/var/tmp/bak"
DATE=$(date +%d)

cd /
# Create directory for projects
printf "Create directory for projects \n==============\n \n"

mkdir -p $PROJECT_ROOT

#Backup current stage
printf "Backup current stage \n==============\n \n"

cd /
mkdir -p $BACKUP_DIR
rm -rf $BACKUP_DIR/*

BACKUP_FILE=$BACKUP_DIRECTORY/$(echo $PROJECT_ROOT | sed 's/\//-/g').tgz
tar zcf ${BACKUP_FILE} $PROJECT_ROOT 2>&1

# Update from github - requires ssh-deploy key
# The project has to be cloned already 
printf "Update from github \n==============\n \n"
cd $PROJECT_ROOT$REPO_NAME
git fetch --all
git checkout master
git reset --hard
git pull origin master

mkdir -p $BINARY_DIR
mkdir -p $PKG_DIR
mkdir -p $LOG_DIR

#Set Go variables
printf "Set Go variables \n==============\n \n"
echo export GOPATH=$PROJECT_ROOT$PKG_DIR

#Get go dependencies
printf "Get go dependencies \n==============\n \n"
go get github.com/gorilla/mux
go get gopkg.in/mgo.v2
go get github.com/stretchr/graceful
go get github.com/gorilla/mux
go get golang.org/x/crypto/bcrypt
go get github.com/asaskevich/govalidator

#Build the current version
printf "Build the current version \n==============\n \n"
go build -o bin/todo-api-go go-todos/api/runner.go

#Reload Apache && Supervisor
printf "Reload Apache && Supervisor \n==============\n \n"
service apache2 restart
service supervisor restart

