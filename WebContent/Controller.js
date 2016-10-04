var app = angular.module('MainApp', ['ngRoute']);
var rootURL = 'https://todo-api.gcraic.com/v0.1/';//All api endpoints start with this base url
var config = {
        headers : {
            'Content-Type':'application/json'
        }
    }

//Provides page routing for the application
app.config(function($routeProvider){
	
	//Root goes to login page, any unknown URLs just redirect to the login page (done in 'otherwise').
	$routeProvider
	.when('/', { 
		resolve: {//check all is okay before routing the page
			"check": function($location, $rootScope){
				
				if($rootScope.loggedIn)//if user is not logged in
				{
					$location.path('/dashboard');
				}
				
			}//end check
		},//end resolve
		templateUrl: 'Login.html'
	})
	.when('/dashboard', { 
		resolve: {//check all is okay before routing to dashboard
			"check": function($location, $rootScope){//check means exactly what it says. we 'check' this function
				
				if(!$rootScope.loggedIn)//if the user is not logged in we redirect him/her to the login page
				{
					$location.path('/');
				}	
			}//end check
		},//end resolve 
		templateUrl: 'Dashboard.html'
	})
	.when('/profile', { 
		resolve: {//check all is okay before routing to profile
			"check": function($location, $rootScope){
				
				if(!$rootScope.loggedIn)
				{
					$location.path('/');
				}	
			}//end check
		},//end resolve
		templateUrl: 'Profile.html'
	})
	.when('/fandq', {
		resolve: {//check all is okay before routing to fandq
			"check": function($location, $rootScope){//check means exactly what it says. we 'check' this function
				
				if(!$rootScope.loggedIn)
				{
					$location.path('/');
				}	
			}//end check
		},//end resolve
		templateUrl: 'FandQ.html'
	})
	.when('/manageTasks', { 
		resolve: {//check all is okay before routing to manageTasks
			"check": function($location, $rootScope){//check means exactly what it says. we 'check' this function
				
				if(!$rootScope.loggedIn)
				{
					$location.path('/');
				}	
			}//end check
		},//end resolve
		templateUrl: 'ManageTasks.html'
	})
	.otherwise({
		redirectTo: '/'
	});
});

//Controller for the login page of the application
app.controller('loginController', function($scope, $http, $location, $rootScope) {
	
	//Event for the sign up button (new user)
	$scope.signup = function(){
	
		//Create a user object and convert it to JSON format
		var endpointNewUser = 'user/new';
		var user = new User($scope.firstname, $scope.surname, $scope.dob, $scope.password, $scope.email);
		var jsonNewUser = angular.toJson(user);
		
		//Post the data to the url endpoint user/new and add header of Content-Type = application/json (in config)
		$http.post(rootURL + endpointNewUser, jsonNewUser, config)
		.then(
			function(response){//if success
				$location.path('/dashboard');//redirect to dashboard
				$rootScope.loggedIn = true;  //set global logged in variable to true.
			}, 
			function(response){//if error
				console.log(response);	//just log it for now	
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
				$location.path('/dashboard');//redirect to dashboard
				$rootScope.loggedIn = true;  //set global logged in variable to true.
			}, 
			function(response){//if error
				console.log(response);//just log it for now		
			}
		);	
	}//end login event
});

app.controller('dashboardController', function($scope) {
	
	//controller for dashboard.html, has scope for that page
	//do stuff in here
	
});

app.controller('profileController', function($scope) {
	
	//controller for Profile.html, has scope for that page
	//do stuff in here
	
});

app.controller('FandQController', function($scope) {
	
	//controller for FandQ.html, has scope for that page
	//do stuff in here
	
});

app.controller('manageTaskController', function($scope) {
	
	//controller for ManageTasks.html, has scope for that page
	//do stuff in here
	
});

