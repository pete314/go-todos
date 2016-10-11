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
				$("#successDialog").dialog("open"); 			//show the error dialog	
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