//Controller for dashboard page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('dashboardController', function($scope, appServices, $http, localStorageService) {
	
	$scope.addNewTask = function(){
		var newTask = new NewTask($scope.taskName, $scope.taskDescription);
		var jsonNewTask = angular.toJson(newTask);
		
		$http.post(rootURL + newTaskUrl, jsonNewTask, {
		    headers: {'Content-Type':'application/json',
		    	'Authorization':'Bearer '+localStorageService.get("accessToken")}
		})
		.then(
			function(response){//if success
				$scope.taskName = "";
				$scope.taskDescription = "";
				$("#successDialog").html("Your new task was successfully created");	//add info to dialog
				$("#successDialog").dialog("open"); 			//show the error dialog	
				getTasks();
			}, 
			function(response){//if error
				$("#errorDialog").html("New task was not created, did you enter data into all fields?");	//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog		
			}
		);	
	}
	
	var getTasks = function(){
		$http.get(rootURL + getTaskListUrl, {
		    headers: {'Content-Type':'application/json',
		    	'Authorization':'Bearer '+localStorageService.get("accessToken")}
		})
		.then(
			function(response){//if success
				$scope.tasks = response.data.Result;
			}, 
			function(response){//if error
				$("#errorDialog").html("Were sorry - there appears to have been an issue retrieving your tasks");	//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog	
			}
		);	
	}
	
	//When user double clicks on an item make it editable
	$scope.showTask = function(task){ 
		
		$('#showTaskDialog').dialog('option', 'title', $scope.tasks[task].name);	//set title to the tasks name
		$("#showTaskDialog").html($scope.tasks[task].content);						//add info to dialog
		$("#showTaskDialog").dialog("open"); 										//show the showTask dialog	
	}
	
	getTasks(); //Fire as soon as user naviates to this page(controller)
	
	var createDialogs = function(){
		appServices.createAllDialogs();//services(RoutingandServices.js) has utility method to create all UI popup dialogs
	}
	
	createDialogs();//Call the create dialog method defined above
	
	$scope.logout = function(){
		appServices.logout();//call the custom app services logout function
	}
});