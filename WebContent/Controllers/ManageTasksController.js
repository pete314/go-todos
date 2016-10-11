//Controller for manage tasks page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('manageTaskController', function($scope, appServices, $http, localStorageService) {
	
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
				$('#errorDialog').dialog('option', 'title', "Problem Retrieving Task Data");	//set title to the tasks name
				$("#errorDialog").html("Were sorry - there was a problem retrieving your tasks");	//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog	
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
        	 $('#successDialog').dialog('option', 'title', "Successful Task Deletion");	//set title to the tasks name
			 $("#successDialog").html("The selected tasks have been deleted");	//add info to dialog
			 $("#successDialog").dialog("open"); 			//show the error dialog	
        	 taskIdCheckList = [];    //empty the current checklist
			 getTasks();			  //Retrieve the tasks again (fresh lists)
         },
         error: function(xhr, textStatus, errorThrown)
         {
        	 $('#errorDialog').dialog('option', 'title', "Problem Deleting Selected Tasks");	//set title to the tasks name
			 $("#errorDialog").html("Were sorry - there was a problem deleting the selected tasks");	//add info to dialog
			 $("#errorDialog").dialog("open"); 			//show the error dialog	
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
						$('#successDialog').dialog('option', 'title', "Successful Task Update");	//set title to the tasks name
						$("#successDialog").html("The selected task was successfully updated");	//add info to dialog
						$("#successDialog").dialog("open"); 			//show the error dialog	
						taskIdCheckList = [];    //empty the current checklist
						getTasks();			  //Retrieve the tasks again (fresh lists)
					}, 
					function(response){//if error
						$('#errorDialog').dialog('option', 'title', "Problem Updating Task");	//set title to the tasks name
						$("#errorDialog").html("Were sorry - there was a problem updating the selected task");	//add info to dialog
						$("#errorDialog").dialog("open"); 			//show the error dialog	
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
	
	//CREATE JQUERY UI DIALOGS WHEN ANGULAR DOCS HAVE FINISHED LOADING
	//JQuery was trying to run this before Angular was ready so dont do it until angular doc is loaded and fully ready
	//Referenced from stackoverflow: http://stackoverflow.com/questions/27776174/type-error-cannot-read-property-childnodes-of-undefined
	angular.element(document).ready(function () {
		
		//Create an error dialog jquery widget
		var createErrorDialog = function(){
			$("#errorDialog").dialog({	//Attach dialog to div with errorDialog id
				autoOpen: false,		//Dont open stright away
				modal: true,		//Dialog has modal behavior, other items on the page will be disabled & cant be interacted with. 
				dialogClass: 'errorDialogStyle', //The class name of the dialog box used for CSS styling
				width: 290,						//The width of the dialog box
				open: function(event, ui) {		//Function called when dialog box opens
					$(".ui-dialog-titlebar-close", ui.dialog | ui).hide(); //Hide defualt close button in titlebar
					$('.ui-dialog-buttonpane').find('button:contains("Close")').addClass('eClossButton');//add css class to button
				},
				buttons: {
					Close: function () {
						$(this).dialog('close'); //Adding a close button
					}
				}
			});//end dialog
		}//end createErrorDialog
		
		//create a success dialog
		var createSuccessDialog = function(){
			$("#successDialog").dialog({	//Attach dialog to div with successDialog id
				autoOpen: false,			//Dont open stright away
				modal: true,			//Dialog has modal behavior, other items on the page will be disabled & cant be interacted with.
				dialogClass: 'successDialogStyle', //The class name of the dialog box
				width: 290,	//The width of the dialog box
				open: function(event, ui) {	//Function called when dialog box opens
					$(".ui-dialog-titlebar-close", ui.dialog | ui).hide();	//Hide defualt close button in titlebar
					$('.ui-dialog-buttonpane').find('button:contains("Close")').addClass('sClossButton');//add css class to button
				},
				buttons: {
					Close: function () {
						$(this).dialog('close'); //Adding a close button
					}
				}
			});//end dialog
		}//end createSuccessDialog
		
		//Call the methods to create custom JQuery Dialogs
		createSuccessDialog();
		createErrorDialog();
		
	});//END CREATION OF JQUERY DIALOGS
	
	//App service method for logging out
	$scope.logout = function(){
		appServices.logout();
	}
});
