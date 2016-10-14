//Controller for fandq page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('FandQController', function($scope, appServices, $http, localStorageService) {
	
	$scope.submitQuestion = function(){
		var userQuestion = new Question($scope.subject, $scope.content)
		var jsonNewQuestion = angular.toJson(userQuestion);
		console.log(jsonNewQuestion);
		
		//Post the data to the url endpoint user/new and add header of Content-Type=application/json(in config at file top)
		$http.post(rootURL + endpointQuestion, jsonNewQuestion, {
		    headers: {'Content-Type':'application/json',
		    	'Authorization':'Bearer '+localStorageService.get("accessToken")}
		})
		.then(
			function(response){//if success
				$('#successDialog').dialog('option', 'title', "Question Sent Successfully");	//set title of the dialog
				$("#successDialog").html("Your question has successfully been sent to us, we will contact you shortly");	//add info to dialog
				$("#successDialog").dialog("open"); 			//show the success dialog	
			}, 
			function(response){//if error
				$('#errorDialog').dialog('option', 'title', "Problem Sending Question");	//set title of the dialog
				$("#errorDialog").html("Unfortunately we were not able to submit your question. Please fill all fields. If you already have its probably us, please try again later.");//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog
			}
		);	
	}//end submitQuestion
	
	var createDialogs = function(){
		appServices.createCommonDialogs();//services(RoutingandServices.js) has utility method to create common UI popup dialogs
	}
	
	createDialogs();//Call the create dialog method defined above
	
	//app service (RoutingandServices.js) utility function for logout
	$scope.logout = function(){
		appServices.logout();
	}
	
});