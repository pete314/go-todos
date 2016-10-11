//Controller for login page of the application, has scope for that entire page
app.controller('loginController', function($scope, $http, $location, localStorageService) {
	
	//Event for the sign up button (new user)
	$scope.signup = function(){
		//Create a user object and convert it to JSON format
		var user = new User($scope.firstname, $scope.surname, $scope.dob, $scope.password, $scope.email);
		var jsonNewUser = angular.toJson(user);
		
		//Post the data to the url endpoint user/new and add header of Content-Type=application/json(in config at file top)
		$http.post(rootURL + endpointNewUser, jsonNewUser, config)
		.then(
			function(response){//if success
				$("#successDialog").html("User created successfully, please login with your creditials");	//add info to dialog
				$("#successDialog").dialog("open"); 			//show the error dialog	
			}, 
			function(response){//if error
				$("#errorDialog").html("User was not created, did you leave out some information?");//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog
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
				$("#errorDialog").html("User not found, or invalid password");	//add info to dialog
				$("#errorDialog").dialog("open"); 			//show the error dialog	
			}
		);	
	}//end login event
	
	//CREATE JQUERY UI DIALOGS WHEN ANGULAR DOCS HAVE FINISHED LOADING
	//JQuery was trying to run this before Angular was ready so dont do it until angular doc is loaded and fully ready
	//Referenced from stackoverflow: http://stackoverflow.com/questions/27776174/type-error-cannot-read-property-childnodes-of-undefined
	angular.element(document).ready(function () {
		//Create an error dialog jquery widget
		var createErrorDialog = function(){
			$("#errorDialog").dialog({	//Attach dialog to div with errorDialog id
				autoOpen: false,		//Dont open stright away
				modal: true,		//Dialog has modal behavior, other items on the page will be disabled & cant be interacted with. 
				title: "Error",		//The dialog boxes title
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
		
		var createSuccessDialog = function(){
			$("#successDialog").dialog({	//Attach dialog to div with successDialog id
				autoOpen: false,			//Dont open stright away
				modal: true,			//Dialog has modal behavior, other items on the page will be disabled & cant be interacted with.
				title: "Successful",	//The dialog boxes title
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
	
		//Call the two methods to create the custom JQuery Dialogs
		createSuccessDialog();
		createErrorDialog();
	});//END CREATION OF JQUERY DIALOGS
	
	//Deals with the response after a successful login.
	function logUserIn(response){
		var userId = response.data.Result.userId;				//Get user id from response 
		var accessToken = response.data.Result.accessToken;		//Get the access token from response
		localStorageService.set("userID", userId);				//Set localStorageService variables...userID
		localStorageService.set("accessToken", accessToken);	//Returned access token
		localStorageService.set("loggedIn", true);				//logged in boolean set to true.
		$location.path('/dashboard');							//redirect to dashboard
	}
});