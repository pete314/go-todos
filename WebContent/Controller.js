var app = angular.module('MainApp', ['ngRoute']);

//Provides page routing for the application
app.config(function($routeProvider){
	
	//Root goes to login page, any unknown URLs just redirect to the login page (done in 'otherwise').
	$routeProvider
	.when('/', { 
		templateUrl: 'Login.html'
	})
	.when('/dashboard', { 
		templateUrl: 'Dashboard.html'
	})
	.when('/profile', { 
		templateUrl: 'Profile.html'
	})
	.when('/fandq', { 
		templateUrl: 'FandQ.html'
	})
	.when('/manageTasks', { 
		templateUrl: 'ManageTasks.html'
	})
	.otherwise({
		redirectTo: '/'
	});
	
});

app.controller('loginController', function($scope) {
	
	//controller for login.html, has scope for that page
	//do stuff in here
	
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