ideControllers.controller('project_new', ['$scope', '$modalInstance', 'data', function($scope, $modalInstance, data) {

	/*
	  $scope.items = items;
	  $scope.selected = {
	    item: $scope.items[0]
	  };
*/
	  $scope.data = data;  
	  $scope.message = {type:'alert-warning', message:'', display:'none'};
	  $scope.project = {name:'', description:''}; 
	  
	  var showMessage = function(type, message){
		  $scope.message.type = type;
		  $scope.message.message = message;
		  $scope.message.display = 'block';
	  };
	  
	  $scope.ok = function () {
		console.log('$scope.data');
		console.log($scope.data);
		
		console.log('$scope.project');
		console.log($scope.project);
		
		if ($scope.data.Projects[$scope.project.name] == null)
		{
			$scope.data.Projects[$scope.project.name] = {meta:$scope.project};
			//add project here
			$modalInstance.close('New project added OK');
			
			//showMessage('alert-success', 'Project will be saved now');
		}
		else
			showMessage('alert-warning', 'A project by this name already exists');
			
			
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	  
}]);