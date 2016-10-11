//Controller for login page of the application, has scope for that entire page
app.controller('loginController', function($scope, $http, $location, localStorageService) {
	
	//Event for the sign up button (new user)
	$scope.signup = function(){
	
		//Create a user object and convert it to JSON format
		var user = new User($scope.firstname, $scope.surname, $scope.dob, $scope.password, $scope.email);
		var jsonNewUser = angular.toJson(user);
		
		//Post the data to the url endpoint user/new and add header of Content-Type=application/json(in config at file top)
		$http.post(rootURL + endpointNewUser, jsonNewUser, config)
		.then(
			function(response){//if success
				alert("User created successfully, please login with your creditials")
			}, 
			function(response){//if error
				alert("Something wrong");
				console.log(response);		//just log it for now	
			}
		);	
	}//end signup event
	
	$scope.login = function(){
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
				alert("Something wrong");
				console.log(response);			//just log it for now		
			}
		);	
	}//end login event
	
	function logUserIn(response){
		var userId = response.data.Result.userId;				//Get user id from response 
		var accessToken = response.data.Result.accessToken;		//Get the access token from response
		localStorageService.set("userID", userId);				//Set localStorageService variables...userID
		localStorageService.set("accessToken", accessToken);	//Returned access token
		localStorageService.set("loggedIn", true);				//logged in boolean set to true.
		$location.path('/dashboard');							//redirect to dashboard
	}
});