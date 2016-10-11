//Using external package to core angular, Local Storage. Creating angular module called 'app'
var app = angular.module('MainApp', ['ngRoute','LocalStorageModule']);

var rootURL = 'https://todo-api.gcraic.com/v0.1/';//All api endpoints start with this base url
//URL endpoints that arent relying on angular local storage defined here. Any that do are defined in the specific controller
//Manage Task Controller endpoints
var getTaskListUrl = "task/get";
var DeleteTaskListUrl = "task/delete";
var updateTaskUrl = "task/update/";
//Login Controller endpoints
var endpointNewUser = 'user/new';
//Dashboard endpoints
var newTaskUrl = "task/new";
var getTaskListUrl = "task/get";


var config = {
        headers : {
            'Content-Type':'application/json'
        }
    }

//App service contains utility methods for the application, needed by all or more than one controller(s).
app.service('appServices', function($location, localStorageService){
	this.logout = function()
	{
		localStorageService.clearAll();			//User is logging out so clear all local storage variables 
		$location.path('/');					//redirect to root, login page
	}
});

//Provides page routing for the application
app.config(function($routeProvider, localStorageServiceProvider, $httpProvider){
	
	//Config the localStorageServiceProvider to local storage
	localStorageServiceProvider
    .setStorageType('localStorage');
	
	//Root goes to login page, any unknown URLs just redirect to the login page (done in 'otherwise').
	$routeProvider
	.when('/', { 
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") == true)//if your logged in already
				{
					$location.path('/dashboard');//redirect to dashboard
				}
				
			}//end check
		},//end resolve
		templateUrl: 'Login.html'
	})
	.when('/dashboard', { 
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") != true)//if your not logged in
				{
					$location.path('/');//redirect to login page
				}
				
			}//end check
		},//end resolve
		templateUrl: 'Dashboard.html'
	})
	.when('/profile', {
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") != true)
				{
					$location.path('/');
				}
				
			}//end check
		},//end resolve
		templateUrl: 'Profile.html'
	})
	.when('/fandq', {
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") != true)
				{
					$location.path('/');
				}
				
			}//end check
		},//end resolve
		templateUrl: 'FandQ.html'
	})
	.when('/manageTasks', { 
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") != true)
				{
					$location.path('/');
				}
				
			}//end check
		},//end resolve
		templateUrl: 'ManageTasks.html'
	})
	.otherwise({
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") != true)
				{
					$location.path('/');
				}
				
			}//end check
		},//end resolve
		redirectTo: '/'
	});
});