ideControllers.controller('project_new', ['$scope', '$modalInstance', 'dataService', function($scope, $modalInstance, dataService) {

	/*
	  $scope.items = items;
	  $scope.selected = {
	    item: $scope.items[0]
	  };
*/
	  $scope.message = {type:'alert-warning', message:'', display:'none'};
	  $scope.project = {name:'', description:''};

	  var showMessage = function(type, message){
		  $scope.message.type = type;
		  $scope.message.message = message;
		  $scope.message.display = 'block';
	  };

	  $scope.ok = function () {

	  	console.log('saving project:::');

	  	dataService.instance.client.get('/Projects/' + $scope.project.name, function(e, project){

	  		console.log('got project:::', e, project);

	  		if (e) return showMessage('alert-danger','error validating save: ' + e.toString())

	  		if (project) return showMessage('alert-warning', 'A project by this name already exists');

	  		dataService.instance.client.setSibling('/Project', $scope.project, function(e, newProject){

	  			if (e) return showMessage('alert-danger','error saving project: ' + e.toString())

	  			console.log('saved project:::', newProject);
	  			$modalInstance.close(newProject);

	  		});

	  	});

	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };

}]);