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
				$('#successDialog').dialog('option', 'title', "Successful Task Creation");	//set title of the dialog
				$("#successDialog").html("Your new task was successfully created");	//add info to dialog
				$("#successDialog").dialog("open"); 			//show the error dialog	
				getTasks();
			}, 
			function(response){//if error
				$('#errorDialog').dialog('option', 'title', "Unsuccessful Task Creation");	//set title of the dialog
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
				$('#errorDialog').dialog('option', 'title', "Task Retrieval Error");	//set title of the dialog
				$("#errorDialog").html("Were sorry - there appears to have been an issue retrieving your tasks");	//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog	
			}
		);	
	}
	
	//JQUERY DIALOG BELOW IS SPECIFIC TO THIS PAGE(not included with create dialog service method for common app dialogs)
	angular.element(document).ready(function () {
	//creates a show task dialog
	var createShowTaskDialog = function(){
		$("#showTaskDialog").dialog({	//Attach dialog to div with showTaskDialog id
			autoOpen: false,			//Dont open stright away
			modal: true,			//Dialog has modal behavior, other items on the page will be disabled & cant be interacted with.
			dialogClass: 'showTaskDialogStyle', //The class name of the dialog box
			width: 290,	//The width of the dialog box
			open: function(event, ui) {	//Function called when dialog box opens
				$(".ui-dialog-titlebar-close", ui.dialog | ui).hide();	//Hide defualt close button in titlebar
				$('.ui-dialog-buttonpane').find('button:contains("Close")').addClass('stClossButton');//add css class to close button
				$('.ui-dialog-buttonpane').find('button:contains("Edit")').addClass('stEditButton');//add css class to edit button
				$('.ui-dialog-buttonpane').find('button:contains("Update")').addClass('stUpdateButton');//add css class to update button
			},
			buttons: {//create the following buttons
				Update: function () {//update button with following click event
					var taskId = localStorageService.get("currentlyOpenTaskId");//Get id of currently selected task
					var taskContent = $('.ui-dialog-content').html();		//Gets content from the dialog
					var taskTitle = $(this).dialog( "option", "title" );	//Get task title from the dialog
					var updateTask = new UpdateTask(taskId, taskTitle, taskContent);//create update object
					var jsonUpdateTask = angular.toJson(updateTask);//convert object to json
					//Ajax caal to update the task
					$.ajax({
				         url: rootURL + updateTaskUrl + taskId, // Url to which the request is send
				         type: "PUT",             // Type of request to be send, called as method
				         dataType: "json",		  //Data expected back
				         data: jsonUpdateTask,		//the data, listof task ids in json
				         headers: {
				        	 'Content-Type':'application/json',
				             'Authorization': 'Bearer '+localStorageService.get("accessToken")
				         },
				         success: function(data)   // A function to be called if request succeeds
				         {
				        	 $('#successDialog').dialog('option', 'title', "Successful Task Update");	//set title to the tasks name
							 $("#successDialog").html("The selected task was successfully updated");	//add info to dialog
							 $("#successDialog").dialog("open"); 			//show the success dialog	
							 getTasks();
				         },
				         error: function(xhr, textStatus, errorThrown)
				         {
				        	 $('#errorDialog').dialog('option', 'title', "Problem Updating Task");	//set title to the tasks name
							 $("#errorDialog").html("Were sorry - there was a problem updating the selected task");	//add info to dialog
							 $("#errorDialog").dialog("open"); 			//show the error dialog	
							 console.log(textStatus);
				         }
				     });//End delete call
					
				},
				Edit: function() {//called when this button is clicked
					
					//referenced from http://jsfiddle.net/Wu4VD/ - toggle dialog content editable
					var $div=$('#showTaskDialog'), isEditable=$div.is('.editable');
				    $('#showTaskDialog').prop('contenteditable',!isEditable).toggleClass('editable');
				    
				    //toggle the text of the edit button
				    $('.stEditButton').text(function(i, text){
				          return text === "Edit" ? "Done" : "Edit";//conditional if/else shorthand
				    })
				      
				    //Toggle disabled/enabled state of update button
				    //http://stackoverflow.com/questions/21898046/toggle-disabled-attribute-and-show-hide-at-same-time-in-jquery
				    if($('.stUpdateButton').prop('disabled')) {
				    	 $('.stUpdateButton').prop('disabled', false).show();
				    } else {
				    	 $('.stUpdateButton').prop('disabled', true).hide();
				    }  
				},
				Close: function () {
					$(this).dialog('close'); //Adding a close button and function that closes the dialog
				}
			}
		});//end dialog
	}//createShowTaskDialog
	
	createShowTaskDialog();
	});//END CREATION OF JQUERY DIALOGS
	
	//When user double clicks on an item make it editable
	$scope.showTask = function(task){ 
		$('#showTaskDialog').dialog('option', 'title', $scope.tasks[task].name);//set title to the tasks name
		$("#showTaskDialog").html($scope.tasks[task].content);					//add info to dialog
		localStorageService.set("currentlyOpenTaskId", $scope.tasks[task].id);		//Hold the task id of currently opened task
		$("#showTaskDialog").dialog("open"); 									//show the showTask dialog	
	}
	
	getTasks(); //Fire as soon as user naviates to this page(controller)
	
	var createDialogs = function(){
		appServices.createCommonDialogs();//services(RoutingandServices.js) has utility method to create common UI popup dialogs
	}
	
	createDialogs();//Call the create dialog method defined above
	
	$scope.logout = function(){
		appServices.logout();//call the custom app services logout function
	}
});