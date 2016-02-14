ideControllers.controller('project_new', ['$scope', '$modalInstance', 'dataService', function($scope, $modalInstance, dataService) {

	  $scope.message = {type:'alert-warning', message:'', display:'none'};
	  $scope.project = {name:'', description:'', type:'Project'};

	  $scope.ok = function () {

	  	dataService.instance.client.get('/Project/*', {criteria:{name:$scope.project.name}}, function(e, projects){

	  		console.log(e, projects);

	  		if (e) return $scope.notify('error validating save: ' + e.toString(), 'danger');

	  		if (projects.length > 0) return $scope.notify('A project by this name already exists', 'warning');

	  		dataService.instance.client.setSibling('/Project', $scope.project, function(e, newProject){

	  			if (e) return $scope.notify('error saving project: ' + e.toString(), 'danger');

	  			$modalInstance.close(newProject);

	  		});

	  	});

	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };

}]);

ideControllers.controller('project_edit', ['$scope', 'dataService', function($scope, dataService) {

	var onSave = function(args){
		 console.log('onSave clicked ');
		 console.log($scope.editData);

		 $scope.editData.meta = $scope.project;
	};

	var onDelete = function(args){
		 console.log('onDelete clicked ');
		 console.log($scope.editData);
	};

	var actions = [
	{
		text:'save',
		handler:onSave,
 		cssClass:'glyphicon glyphicon-floppy-disk'
	},
	{
		text:'delete',
		handler:onDelete,
 		cssClass:'glyphicon glyphicon-remove'
	}];

 	$scope.actions = actions;
 	$scope.$emit('editor_loaded', actions);


}]);