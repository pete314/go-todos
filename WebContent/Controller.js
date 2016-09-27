var app = angular.module('MainApp', ['ngRoute']);

//Provides page routing for the application
app.config(function($routeProvider){
	
	//Root goes to login page, any unknown URLs just redirect to the login page.
	$routeProvider
	.when('/', { 
		templateUrl: 'Login.html'
	})
	.when('/dashboard', { 
		templateUrl: 'Dashboard.html'
	})
	.when('/fandq', { 
		templateUrl: 'FandQ.html'
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

app.controller('FandQController', function($scope) {
	
	//controller for FandQ.html, has scope for that page
	//do stuff in here
	
});