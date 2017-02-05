Contributors
---
[Ciaran Whyte](https://github.com/whytekieran)


[Peter Nagy](https://github.com/pete314)


**Introduction**
-------------

The Go to-do web application will give the user the ability to create their own secure personal login and manage their everyday tasks effectively. Simply laid out and easy to use this **To-do** application will help the user stay on track everyday.


##**Technologies **
-------------

###**Go (GoLang)**
Go is a free and open source language created by Google circa 2007. It is a compiled, statically typed language which resembles the language **C**. Some of the features **Go** has is a syntax and enviroment adapting patterns more common in dynamic languages. it is scalable to large systems(as **Java** and **C++**).


###**AngularJS**
AngularJS is a structural framework for dynamic web applications. HTML is used as the template language and you can extend HTML's syntax to express your applications components clearly. Angular's data binding and dependency injection saves the developer from having to write as much code as would have been needed in the past. This all takes place in the browser which makes AngularJS a good partner with any and all server technologies.

AngularJS uses directives to teach the browser new syntax:

 * **Data binding**
 * **DOM control structures for repeating**
 * **Support forms and form validation**
 * **Dom event handling**
 * **Groups HTML into reusable components**

###**Bootstrap**

Bootstrap is a free and open source front-end web framework. It is used for designing websites and web applications. It contains HTML and CSS based design templates. These can be used for buttons, forms, navigation and other interface components. It also contains JavaScript extensions. What sets Bootstrap apart from other web frameworks is it only concerns itself with front-end development. It supports **<em>responsive web design</em>** which is where the layout of the web pages adjusts dynamically suiting whatever device it is being displayed on (desktop, mobile, tablet, etc...).


###**MongoDB**
MongoDB is an open source database that uses a document-orientated data model. It is considered a **<em>NoSql</em>** database meaning instead of the relational database model that uses tables and rows MongoDB is built on the architecture of collections and documents. Documents are made up of sets of key-value pairs and are the basic unit of data. Collections contains sets of documents and functions. MongoDB supports dynamic schema design, which allows the documents in a collection to have different fields and structures. BSON is a computer data interchange format used mainly as a data storage and network transfer format in MongoDB. This provides a binary representation of JSON-like documents.

###**Redis**
[Redis](https://redis.io/) is an open source software project that implements dara structure servers. It can be used as a database, cache and message broker. The difference between Redis and other structured storage systems is that redis supports not only Strings, but also abstract data types:

 * **Lists of strings**
 * **Sets of strings**
 * **Sorted sets of strings**
 * **Hash tables where keys and values are strings**
 * **HyperLogLogs **

###**NGINX**
NGINX [prononced engine x] is an HTTP and reverse proxy server, a mail proxy server, and a generic TCP/UDP proxy server.

###**Postman**

Postman is a tool to help the developer keep track of the efficiency of his or hers API. Postman allows you to create requests which can then be analysed to see the response from the API. These requests can be stored and used when ever needed.


##**Application Structure**
-------------
![Application Structure](ReadMeImg/app.jpg)


####**Scripts**
-------------
The script files for the application are accessible on Github at [go-todos/scripts/](https://github.com/pete314/go-todos/tree/master/scripts).


##**Launching The Application**
-------------
####**Go To-do User Guide**
A breakdown of how to use the "Go To-do" application:

 * **Start the application locally**
 * **Open your preferred web browser(Google Chrome, Mozilla Firefox, etc...)**
 * **When the page loads you will be brought to the login/signup page**
 * **On the page there is a 'Sign Up Today' section**
 * **Fill out the required information: First name, Surname, email, password and date of birth**
 * **On successful creation of a user profile you will be prompted to login**
 * **At the top right hand side of the page you will see two text areas and a button**
 * **Enter your email in the first and your password in the second box and click the 'Sign In' button**
 * **You will be redirected to the Dashboard**
 * **Here you can add tasks and see a list of your already created tasks**
 * **In the header bar there is five icons Dashboard, Task Manager, Profile, F&Q and Logout**
 * **The task Manager allows you to delete and edit existing tasks**
 * **Profile allow the user edit their details**
 * **F&Q is where the user can ask a question about the site if help is needed**
 * **And finally Logout lets the user exit the application**

#### Installing the application locally (and run)
**The application dependacies:**
- Golang [install guide for Windows](http://www.wadewegner.com/2014/12/easy-go-programming-setup-for-windows/)
- MongoDb [install guide for Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)
- NodeJs with NPM [install guide for Windows](http://blog.teamtreehouse.com/install-node-js-npm-windows)
- LiteServer (for ui development) [install guide for Windows](https://www.npmjs.com/package/lite-server)
- **For Linux users install packeges from cli**, an example for Ubuntu


```bash
# The following is tested in Ubuntu LTS 16.04
sudo -i # Enter your password (should be in sudoers)
# Add mongo package key
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
# Add package
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list

#Install dependacies
apt-update && apt-get install -y nodejs golang mongodb-org npm

#Set the path for golang
mkdir -p /opt/go
mkdir -p /opt/go/pkg
mkdir -p /opt/go/bin
export GOPATH=/opt/go/pkg
```

**Running the REST API**
- open cli
- clone the git repository
- navigate to the /go-todos/api/
- create a file from current location "./var/www/config/smtp.local.json" if you want to enable emailing [sample config](https://github.com/pete314/go-todos/wiki/smtp.local.json)
- Make sure that the port 8080 is not in use
- Make sure that mongodb is running
- execute "go run runner.go" or create and executable "go install runner.go"

If there are any issues please follow the guide available in [scripts folder](https://github.com/pete314/go-todos/tree/master/scripts)
**Note:** 
- Keep the console open as the application will log all alerts or errors there
- With default configurations the database does not require any configuration, key generation is built into API

**Running the User Interface**
The repository has to be cloned and REST api should run at this stage.
- open cli
- navigate to '/path/to/go-todos/WebContent'
- execute 'lite-server'
- please copy the application url from the lite-server outpout

**Note:**
- An alternative to lite-server is http-server which can be installed by [following this guide](https://www.npmjs.com/package/http-server). Site user interface can be run by "http-server -o" instead of "lite-server"

### Benchamrk

**Overall performance:** 755 requests/sec (50 concurent conections) 

```bash
ab -c 50 -n 1000 -H "Authorization: Bearer 5345c6cbdee4462a708d51194ff5802d52b3772d28f15bb3215aac76051ec46d" "http://todo.test.com:8080/v0.1/user/get/57ee3874c720b22f7c1ae90b"

This is ApacheBench, Version 2.3 <$Revision: 1554214 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Server Software:        go-todo-api/v0.1
Server Hostname:        todo.test.com
Server Port:            8080

Document Path:          /v0.1/user/get/57ee3874c720b22f7c1ae90b
Document Length:        231 bytes

Concurrency Level:      50
Time taken for tests:   1.323 seconds
Complete requests:      1000
Failed requests:        0
Total transferred:      439000 bytes
HTML transferred:       231000 bytes
Requests per second:    755.90 [#/sec] (mean)
Time per request:       66.147 [ms] (mean)
Time per request:       1.323 [ms] (mean, across all concurrent requests)
Transfer rate:          324.06 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      1       4
Processing:    25   59  14.1     59     294
Waiting:       19   58  14.2     58     294
Total:         25   59  14.1     59     295
```

##**References**
-------------

 * [Golang.org](https://golang.org)
 * [angularjs.org](https://angularjs.org/)
 * [redis.io](https://redis.io/)
 * [bootstrap.com](getbootstrap.com)
 * [mongodb.com](https://www.mongodb.com/)
 * [getpostman.com](https://www.getpostman.com)
 * [nginx.com](https://www.nginx.com)

