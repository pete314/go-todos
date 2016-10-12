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
				$('#errorDialog').dialog('option', 'title', "Problem Retrieving User Data");	//set title to the tasks name
				$("#errorDialog").html("Were sorry - there was a problem retrieving your details");	//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog	
			}
		);	
    }
	
	getUserData();//When this control is navigated to call function to GET user details and output to the view
    
    //Function to PUT updated user profile to the server
    $scope.updateProfile = function(){
    	var userAll = new UserUpdateAll($scope.email, $scope.firstname, $scope.surname, $scope.dob);//get data from view
    	var jsonUserAll = angular.toJson(userAll);//convert object to json
    	
    	//HTTP PUT the data
    	$http.put(rootURL + putUrl, jsonUserAll, {
		    headers: {'Content-Type':'application/json',
		    	'Authorization':'Bearer '+localStorageService.get("accessToken")}
		})
		.then(
			function(response){//if success
				$('#successDialog').dialog('option', 'title', "Successful Update");	//set title to the tasks name
				$("#successDialog").html("Your details were updated successfully");	//add info to dialog
				$("#successDialog").dialog("open"); 			//show the success dialog	
				getUserData();					//View is updated
			}, 
			function(response){//if error
				$('#errorDialog').dialog('option', 'title', "Problem Updating Details");	//set title to the tasks name
				$("#errorDialog").html("Were sorry - there was a problem updating your details");	//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog	
			}
		);	
    }
    
    //Function to PATCH updated user profile to the server
    $scope.updatePassword = function(){
    	var userPassword = new UserUpdatePassword($scope.password);//get data from view
    	var jsonUserPassword = angular.toJson(userPassword);//convert object to json
    	
    	//HTTP PATCH the data - used to update password. (single field)
    	$http.patch(rootURL + patchUrl, jsonUserPassword, {
		    headers: {'Content-Type':'application/json',
		    	'Authorization':'Bearer '+localStorageService.get("accessToken")}
		})
		.then(
			function(response){//if success
				$('#successDialog').dialog('option', 'title', "Successful Password Change");	//set title to the tasks name
				$("#successDialog").html("Your password was updated successfully");	//add info to dialog
				$("#successDialog").dialog("open"); 			//show the error dialog	
			}, 
			function(response){//if error
				$('#errorDialog').dialog('option', 'title', "Problem Changing Password");	//set title to the tasks name
				$("#errorDialog").html("Were sorry - there was a problem updating your password");	//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog	
			}
		);	
    }
    
    var createDialogs = function(){
		appServices.createCommonDialogs();//services(RoutingandServices.js) has utility method to create common UI popup dialogs
	}
	
	createDialogs();//Call the create dialog method defined above
    
    //Function to log out user, call function from apps services (defined after app.config at the top)
	$scope.logout = function(){
		appServices.logout();
	}
	
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