//Controller for fandq page of the application, has scope for that entire page, passing in custom service as parameter
app.controller('FandQController', function($scope, appServices) {
	
	$scope.logout = function(){
		appServices.logout();
	}
	
});