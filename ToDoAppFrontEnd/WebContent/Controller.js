var app = angular.module('MainApp', ['ngRoute']);

app.config(function($routeProvider){
	
	$routeProvider
	.when('/', { 
		templateUrl: 'Login.html'
	})
	.otherwise({
		redirectTo: '/'
	});
	
});