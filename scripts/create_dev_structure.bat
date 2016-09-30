:: Author: Peter Nagy - peternagy.ie 
:: Source: https://github.com/pete314/go-todos
:: Description: This script is meant to set up the development environment on Windows OS

:: Create folder structure
if not exist "go-project-dara-ciaran-peter" md go-project-dara-ciaran-peter
cd go-project-dara-ciaran-peter

if not exist "bin" md bin
if not exist "pkg" md pkg
if not exist "src" md src

:: Grab the project source
cd src
git clone git@github.com:pete314/go-todos.git
cd ..

:: Set the current project as go path
:: set %GOPATH%=%~dp0\pkg
echo %~dp0

:: Grab all dependencies
:: should add all depe
SET sources[0]="github.com/gorilla/mux"
SET sources[1]="gopkg.in/mgo.v2"
SET sources[2]="github.com/stretchr/graceful"
SET sources[3]="github.com/gorilla/mux"
SET sources[4]="golang.org/x/crypto/bcrypt"
SET sources[4]="github.com/asaskevich/govalidator"


for /F "tokens=2 delims==" %%s in ('set sources[') do go get %%s

:: Run the UI
cd src\go-todos\WebContent
http-server -o