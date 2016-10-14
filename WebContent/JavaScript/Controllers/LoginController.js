//Controller for login page of the application, has scope for that entire page
app.controller('loginController', function($scope, $http, $location, localStorageService, appServices) {
	
	//Event for the sign up button (new user)
	$scope.signup = function(){
		//Create a user object and convert it to JSON format
		var user = new User($scope.firstname, $scope.surname, $scope.dob, $scope.password, $scope.email);
		var jsonNewUser = angular.toJson(user);
		
		//Post the data to the url endpoint user/new and add header of Content-Type=application/json(in config at file top)
		$http.post(rootURL + endpointNewUser, jsonNewUser, config)
		.then(
			function(response){//if success
				$('#successDialog').dialog('option', 'title', "Successful User Creation");	//set title of the dialog
				$("#successDialog").html("User created successfully, please login with your creditials");	//add info to dialog
				$("#successDialog").dialog("open"); 			//show the success dialog	
			}, 
			function(response){//if error
				$('#errorDialog').dialog('option', 'title', "Unsuccessful User Creation");	//set title of the dialog
				$("#errorDialog").html("User was not created, did you leave out some information?");//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog
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
				$('#errorDialog').dialog('option', 'title', "Unsuccessful Login");	//set title of the dialog
				$("#errorDialog").html("User not found, or invalid password");	//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog	
			}
		);	
	}//end login event
	
	var createDialogs = function(){
		appServices.createCommonDialogs();//services(RoutingandServices.js) has utility method to create common UI popup dialogs
	}
	
	createDialogs();//Call the create dialog method defined above
	
	//Deals with the response after a successful login.
	function logUserIn(response){
		var userId = response.data.Result.userId;				//Get user id from response 
		var accessToken = response.data.Result.accessToken;		//Get the access token from response
		localStorageService.set("userID", userId);				//Set localStorageService variables...userID
		localStorageService.set("accessToken", accessToken);	//Returned access token
		localStorageService.set("loggedIn", true);				//logged in boolean set to true.
		$location.path('/dashboard');							//redirect to dashboard
	}
});