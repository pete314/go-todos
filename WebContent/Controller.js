//Using external package to core angular, Local Storage
var app = angular.module('MainApp', ['ngRoute','LocalStorageModule']);
var rootURL = 'https://todo-api.gcraic.com/v0.1/';//All api endpoints start with this base url
var config = {
        headers : {
            'Content-Type':'application/json'
        }
    }

//App service contains utility methods for the application, needed by all controllers.
app.service('appServices', function($location, localStorageService){
	
	this.logout = function()
	{
		localStorageService.clearAll();			//User is logging out so clear all local storage variables 
		$location.path('/');					//redirect to root, login page
	}
	
});

//Provides page routing for the application
app.config(function($routeProvider, localStorageServiceProvider, $httpProvider){
	
	//Config the localStorageServiceProvider to local storage
	localStorageServiceProvider
    .setStorageType('localStorage');
	
	//Root goes to login page, any unknown URLs just redirect to the login page (done in 'otherwise').
	$routeProvider
	.when('/', { 
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") == true)//if your logged in already
				{
					$location.path('/dashboard');//redirect to dashboard
				}
				
			}//end check
		},//end resolve
		templateUrl: 'Login.html'
	})
	.when('/dashboard', { 
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") != true)//if your not logged in
				{
					$location.path('/');//redirect to login page
				}
				
			}//end check
		},//end resolve
		templateUrl: 'Dashboard.html'
	})
	.when('/profile', {
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") != true)
				{
					$location.path('/');
				}
				
			}//end check
		},//end resolve
		templateUrl: 'Profile.html'
	})
	.when('/fandq', {
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") != true)
				{
					$location.path('/');
				}
				
			}//end check
		},//end resolve
		templateUrl: 'FandQ.html'
	})
	.when('/manageTasks', { 
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") != true)
				{
					$location.path('/');
				}
				
			}//end check
		},//end resolve
		templateUrl: 'ManageTasks.html'
	})
	.otherwise({
		resolve: {//resolve basically means do this stuff before the routing and check all is okay
			"check": function($location, localStorageService){//check means exactly what it says. we 'check' this function
				
				if(localStorageService.get("loggedIn") != true)
				{
					$location.path('/');
				}
				
			}//end check
		},//end resolve
		redirectTo: '/'
	});
});

//Controller for login page of the application, has scope for that entire page
app.controller('loginController', function($scope, $http, $location, localStorageService) {
	
	//Event for the sign up button (new user)
	$scope.signup = function(){
	
		//Create a user object and convert it to JSON format
		var endpointNewUser = 'user/new';
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

//Controller for dashboard page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('dashboardController', function($scope, appServices, $http, localStorageService) {
	
	var newTaskUrl = "task/new";
	var getTaskListUrl = "task/get";
	
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

//Controller for fandq page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('FandQController', function($scope, appServices) {
	
	$scope.logout = function(){
		appServices.logout();
	}
	
});

//Controller for manage tasks page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('manageTaskController', function($scope, appServices, $http, localStorageService) {
	
	var getTaskListUrl = "task/get";
	var DeleteTaskListUrl = "task/delete";
	var updateTaskUrl = "task/update/";
	var taskIdCheckList = [];//Holds list of JSON objects containing task id and 'checked' value
	$scope.tasks = [];//Holds all tasks, looped over with ng-repeat to display tasks to the user.
	
	var getTasks = function(){
		$http.get(rootURL + getTaskListUrl, {
		    headers: {'Content-Type':'application/json',
		    	'Authorization':'Bearer '+localStorageService.get("accessToken")}
		})
		.then(
			function(response){//if success
				$scope.tasks = response.data.Result;//$scope.tasks is looped over in view with ng-repeat to display tasks
				var allResults = response.data.Result;//Get all results from response
				allResults.forEach(createCheckList);//For each result retrieved from response call this function (below)
			}, 
			function(response){//if error
			   console.log(response);//just log error for now
			}
		);	
	}
	
	//Function is apart of for-each loop above, pushes each task id to list along with a 'checked' value
	function createCheckList(result){
		taskIdCheckList.push({'taskId':result.id, 'checked':'false'});
	}
	
	getTasks();//Called when this controller (ManageTasks.html) is navigated to. gets all tasks from the API.
	
	//Gets all currently 'checked' tasks and send all their task ids to the API for deletion
	$scope.deleteTask = function(){
	 var deleteIdList = [];
	 
	 //Loop over check list and only get the checked tasks, then add them to their own list
	 for(i = 0; i < taskIdCheckList.length; ++i){
		 
		 if(taskIdCheckList[i].checked == "true"){
			 deleteIdList.push(taskIdCheckList[i].taskId);
		 } 
	 }
	 
	 var deleteTasks = new DeleteTasks(deleteIdList);//Create object from list of checked tasks for json conversion
	 var jsonDeleteIds = angular.toJson(deleteTasks);//convert object to json
	 
	 //Use some JQuery because angular delete will not allow a body
     $.ajax({
         url: rootURL + DeleteTaskListUrl, // Url to which the request is send
         type: "DELETE",             // Type of request to be send, called as method
         dataType: "json",		  //Data expected back
         data: jsonDeleteIds,		//the data, listof task ids in json
         headers: {
        	 'Content-Type':'application/json',
             'Authorization': 'Bearer '+localStorageService.get("accessToken")
         },
         success: function(data)   // A function to be called if request succeeds
         {
        	 taskIdCheckList = [];    //empty the current checklist
			 getTasks();			  //Retrieve the tasks again (fresh lists)
         },
         error: function(xhr, textStatus, errorThrown)
         {
        	 alert("Something wrong");
			 console.log(textStatus);			//just log it for now	
         }
     });//End delete call
	}//end deleteTask
	
	//Whenever a checkbox is checked call this function, check or uncheck the corresponding value in the check list.
	$scope.statusChanged = function(index){
		
		if(taskIdCheckList[index].checked == "false")
		{
			taskIdCheckList[index].checked = "true";
		}
		else if(taskIdCheckList[index].checked == "true")
		{
			taskIdCheckList[index].checked = "false";
		}
		
		//console.log($scope.tasks[index].content);
	}
	
	//When user double clicks on an item make it editable
	$scope.contentEdit = function(task){ 
		
		if(event.target.contentEditable == "false")
		{
			event.target.contentEditable = "true";
		}
		else
		{
			event.target.contentEditable = "false";
		}
	}
	
	var gimme = function()
	{
		console.log(localStorageService.get("accessToken"));
	}
	
	gimme();
	
	//Send edited task, user can only edit one task at a single time
	$scope.editTask = function(){
		 var editCount = 0;
		 var indexEdit = -1;
		 
		 //Loop over check list and make sure only one task is checked.
		 for(i = 0; i < taskIdCheckList.length; ++i){
			 
			 if(taskIdCheckList[i].checked == "true"){
				 ++editCount
				 indexEdit = i;
			 } 
		 }
		 
		 if(editCount == 1){
			 $scope.tasks[indexEdit].id = taskIdCheckList[indexEdit].taskId;//Make sure we have the correct task id
			 $scope.tasks[indexEdit].name = ((document.getElementById("name")).innerHTML).trim();
			 $scope.tasks[indexEdit].content = ((document.getElementById("content")).innerHTML).trim();
			 
			 
			 var updateTask = new UpdateTask($scope.tasks[indexEdit].id, $scope.tasks[indexEdit].name, $scope.tasks[indexEdit].content);
			 var jsonUpdateTask = angular.toJson(updateTask);//convert object to json
			 console.log(jsonUpdateTask);
			 //Sent http put to update the task
			 $http.put(rootURL + updateTaskUrl + updateTask.id, jsonUpdateTask, {
				    headers: {'Content-Type':'application/json',
				    	'Authorization':'Bearer '+localStorageService.get("accessToken")}
				})
				.then(
					function(response){//if success
						alert("Succesful Update")
						taskIdCheckList = [];    //empty the current checklist
						getTasks();			  //Retrieve the tasks again (fresh lists)
					}, 
					function(response){//if error
					   console.log(response);//just log error for now
					}
				);	
		 }
		 else{
			 alert("You can only edit one task at a single time, you either have to many or no tasks checked.");
		 }
	}
	
	//When user hits the enter key call content edit again which controls if field is currently editable
	$scope.editEnter = function(task){
		
		if(event.keyCode == 13)
		{
			$scope.contentEdit(task);
		}
	}
	
	//App service method for logging out
	$scope.logout = function(){
		appServices.logout();
	}
});

