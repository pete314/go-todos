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
	
	//CREATE JQUERY UI DIALOGS WHEN ANGULAR DOCS HAVE FINISHED LOADING
	//JQuery was trying to run this before Angular was ready so dont do it until angular doc is loaded and fully ready
	//Referenced from stackoverflow: http://stackoverflow.com/questions/27776174/type-error-cannot-read-property-childnodes-of-undefined
	angular.element(document).ready(function () {
		//Create an error dialog jquery widget
		var createErrorDialog = function(){
			$("#errorDialog").dialog({	//Attach dialog to div with errorDialog id
				autoOpen: false,		//Dont open stright away
				modal: true,		//Dialog has modal behavior, other items on the page will be disabled & cant be interacted with. 
				title: "Error Adding New Task",		//The dialog boxes title
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
				title: "Successful Task Creation",	//The dialog boxes title
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
		
		//creates a show task dialog
		var createShowTaskDialog = function(){
			$("#showTaskDialog").dialog({	//Attach dialog to div with successDialog id
				autoOpen: false,			//Dont open stright away
				modal: true,			//Dialog has modal behavior, other items on the page will be disabled & cant be interacted with.
				dialogClass: 'showTaskDialogStyle', //The class name of the dialog box
				width: 290,	//The width of the dialog box
				open: function(event, ui) {	//Function called when dialog box opens
					$(".ui-dialog-titlebar-close", ui.dialog | ui).hide();	//Hide defualt close button in titlebar
					$('.ui-dialog-buttonpane').find('button:contains("Close")').addClass('stClossButton');//add css class to button
				},
				buttons: {
					Close: function () {
						$(this).dialog('close'); //Adding a close button
					}
				}
			});//end dialog
		}
	
		//Call the methods to create the custom JQuery Dialogs
		createShowTaskDialog();
		createSuccessDialog();
		createErrorDialog();
	});//END CREATION OF JQUERY DIALOGS
	
	$scope.logout = function(){
		appServices.logout();//call the custom app services logout function
	}
});