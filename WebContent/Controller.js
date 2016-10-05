//Using external package to core angular, Local Storage
var app = angular.module('MainApp', ['ngRoute','LocalStorageModule']);
var rootURL = 'https://todo-api.gcraic.com/v0.1/';//All api endpoints start with this base url
var config = {
        headers : {
            'Content-Type':'application/json'
        }
    }

//App service contains utility methods for the application, needed by all controllers.
app.service('appServices', function($location, localStorageService){
	
	this.logout = function()
	{
		localStorageService.clearAll();			//User is logging out so clear all local storage variables 
		$location.path('/');					//redirect to root, login page
	}
	
});

//Provides page routing for the application
app.config(function($routeProvider, localStorageServiceProvider){
	
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

//Controller for login page of the application, has scope for that entire page
app.controller('loginController', function($scope, $http, $location, localStorageService) {
	
	//Event for the sign up button (new user)
	$scope.signup = function(){
	
		//Create a user object and convert it to JSON format
		var endpointNewUser = 'user/new';
		var user = new User($scope.firstname, $scope.surname, $scope.dob, $scope.password, $scope.email);
		var jsonNewUser = angular.toJson(user);
		
		//Post the data to the url endpoint user/new and add header of Content-Type=application/json(in config at file top)
		$http.post(rootURL + endpointNewUser, jsonNewUser, config)
		.then(
			function(response){//if success
				logUserIn(response);		//log user in, defined at bottom of this controller
			}, 
			function(response){//if error
				console.log(response);		//just log it for now	
			}
		);	
	}//end signup event
	
	$scope.login = function()
	{
		var endpointLoginUser = 'user/login';
		var userLogin = new UserLogin($scope.passwordLogin, $scope.emailLogin);
		var jsonLoginUser = angular.toJson(userLogin);
		
		//Post the data to the url endpoint user/login and add header of Content-Type = application/json (in config)
		$http.post(rootURL + endpointLoginUser, jsonLoginUser, config)
		.then(
			function(response){//if success
				logUserIn(response);			//log user in, defined at bottom of this controller
			}, 
			function(response){//if error
				console.log(response);			//just log it for now		
			}
		);	
	}//end login event
	
	function logUserIn(response)
	{
		var responseResult = response.data.Result;		//Get result url from response key value 'Result'
		var userId = responseResult.split('/')[3];		//Get the users id from it
		localStorageService.set("userID", userId);		//Set localStorageService variables
		localStorageService.set("loggedIn", true);
		$location.path('/dashboard');					//redirect to dashboard
	}
});

//Controller for dashboard page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('dashboardController', function($scope, appServices) {
	
	$scope.logout = function()
	{
		appServices.logout();//call the custom app services logout function
	}
});

//Controller for profile page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('profileController', function($scope, appServices) {
	
	$scope.logout = function()
	{
		appServices.logout();
	}
	
});

//Controller for fandq page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('FandQController', function($scope, appServices) {
	
	$scope.logout = function()
	{
		appServices.logout();
	}
	
});

//Controller for manage tasks page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('manageTaskController', function($scope, appServices) {
	
	$scope.logout = function()
	{
		appServices.logout();
	}
	
});

