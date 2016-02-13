ideControllers.controller('project_new', ['$scope', '$modalInstance', 'dataService', function($scope, $modalInstance, dataService) {

	  $scope.message = {type:'alert-warning', message:'', display:'none'};
	  $scope.project = {name:'', description:'', type:'Project'};

	  var showMessage = function(type, message){
		  $scope.message.type = type;
		  $scope.message.message = message;
		  $scope.message.display = 'block';
	  };

	  $scope.ok = function () {

	  	dataService.instance.client.get('/Projects/' + $scope.project.name, function(e, project){

	  		if (e) return showMessage('alert-danger','error validating save: ' + e.toString())

	  		if (project) return showMessage('alert-warning', 'A project by this name already exists');

	  		dataService.instance.client.setSibling('/Project', $scope.project, function(e, newProject){

	  			if (e) return showMessage('alert-danger','error saving project: ' + e.toString())

	  			$modalInstance.close(newProject);

	  		});

	  	});

	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };

}]);

ideControllers.controller('project_edit', ['$scope', function($scope) {

	 $scope.project =  angular.copy($scope.editData);

	 $scope.getArray = function(items){
		  var returnArray = [];
		  for (var itemName in items)
			  returnArray.push(itemName);
		  return returnArray;
	  };


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
	 console.log('project_edit controller loaded');

}]);