//Controller for profile page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('profileController', function($scope, appServices, localStorageService, $http) {
	
	var getUrl = "user/get/"+localStorageService.get("userID");//Creates the url for getting user data (GET)
	var putUrl = "user/update/"+localStorageService.get("userID");//Creates the url for putting updated user data (PUT)
	var patchUrl = "user/edit/"+localStorageService.get("userID")+"/password";//Creates the url for patching updated user password (PATCH)
	
	
	//Get request for the user data
	var getUserData =  function () {
		$http.get(rootURL + getUrl, {
		    headers: {'Content-Type':'application/json',
		    	'Authorization':'Bearer '+localStorageService.get("accessToken")}
		})
		.then(
			function(response){//if success
				outputUserData(response);//call function to output the user data to the view (defined below)
			}, 
			function(response){//if error
			   console.log(response);//just log error for now
			}
		);	
    }
    
    //Function to PUT updated user profile to the server
    $scope.updateProfile = function(){
    	var userAll = new UserUpdateAll($scope.email, $scope.firstname, $scope.surname, $scope.dob);//get data from view
    	var jsonUserAll = angular.toJson(userAll);//convert object to json
    	
    	$http.put(rootURL + putUrl, jsonUserAll, config)//HTTP PUT the data
		.then(
			function(response){//if success
				alert("Succesful Update")
				getUserData();					//View is updated
			}, 
			function(response){//if error
			   console.log(response);//just log error for now
			}
		);	
    }
    
    //Function to PATCH updated user profile to the server
    $scope.updatePassword = function(){
    	var userPassword = new UserUpdatePassword($scope.password);//get data from view
    	var jsonUserPassword = angular.toJson(userPassword);//convert object to json
    	
    	$http.patch(rootURL + patchUrl, jsonUserPassword, config)//HTTP PATCH the data
		.then(
			function(response){//if success
				alert("Succesful Password Update")	//alert user
			}, 
			function(response){//if error
			   console.log(response);//just log error for now
			}
		);	
    }
    
    //Function to log out user, call function from apps services (defined after app.config at the top)
	$scope.logout = function(){
		appServices.logout();
	}
	
	getUserData();//When this control is navigated to call function to GET user details and output to the view
	
	//Function that gets the response data and it so we can output the users details in the view.
	function outputUserData(response){
		var responseEmail = response.data.Result.email;
		var responseFirstName = response.data.Result.firstname;
		var responseSurname = response.data.Result.surname;
		var responseDOB = response.data.Result.dob;
		$scope.email = responseEmail;
		$scope.firstname = responseFirstName;
		$scope.surname = responseSurname;
		$scope.dob = responseDOB;
	}
});