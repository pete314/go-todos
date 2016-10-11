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
				getTasks();
			}, 
			function(response){//if error
				alert("Something wrong");
				console.log(response);			//just log it for now		
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
			   console.log(response);//just log error for now
			}
		);	
	}
	
	getTasks(); //Fire as soon as user naviates to this page(controller)
	
	$scope.logout = function(){
		appServices.logout();//call the custom app services logout function
	}
});