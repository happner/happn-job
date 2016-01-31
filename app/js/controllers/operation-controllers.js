ideControllers.controller('operation_new', ['$scope', '$modalInstance', 'data', function($scope, $modalInstance, data) {

	  $scope.data = data;  
	  $scope.message = {type:'alert-warning', message:'', display:'none'};
	  $scope.operation = {name:'', description:'', project:'', src:'', type: 'operation', editable:true}; 
	  
	  var showMessage = function(type, message){
		  $scope.message.type = type;
		  $scope.message.message = message;
		  $scope.message.display = 'block';
	  };
	  
	  var getProjectsArray = function(projects){
		  var returnArray = [];
		  for (var project in projects)
			  returnArray.push(project);
		  return returnArray;
	  };
	  
	  $scope.getProjectsArray = getProjectsArray;
	  
	  $scope.ok = function () {
		  
		console.log('$scope.data');
		console.log($scope.data);
		
		console.log('$scope.operation');
		console.log($scope.operation);
		
		var operationObj = {meta: $scope.operation};
		var okToSave = false;
		
		if ($scope.data.Projects[$scope.operation.project]['Operations'] == null)
		{
			$scope.data.Projects[$scope.operation.project]['Operations'] = {};
			okToSave = true;
		}
		else
		{
			if ($scope.data.Projects[$scope.operation.project]['Operations'][$scope.operation.name] != null)
				showMessage('alert-warning', 'A operation by this name already exists');
			else
			{
				okToSave = true;
			}
		}
		
		if (okToSave)
		{
			$scope.data.Projects[$scope.operation.project]['Operations'][$scope.operation.name] = operationObj;
			$modalInstance.close('New project added OK');
		}
			
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	  
}]);

ideControllers.controller('operation_edit', ['$scope', 'dataService', 'AppSession', function($scope, dataService, AppSession) {

	 console.log('$scope.editData');
	 console.log($scope.editData);
	 
	 if ($scope.editData.meta.currentCode == null)
		 $scope.editData.meta.currentCode = AppSession.defaultOperationCode;

	 $scope.editorCode = base64.decode($scope.editData.meta.currentCode);
	 
	 console.log($scope.editorCode);
	 
	 var test = 'blah';
	 
	 var onSave = function(args){
		 console.log('onSave clicked ');
		 console.log($scope.editData);
		 
		 $scope.editData.meta.currentCode = base64.encode($scope.editorCode);
	 };
	
	 var actions = [
		{
			text:'undo',
			handler:onSave,
	 		cssClass:'glyphicon glyphicon-arrow-left'
		},
		{
			text:'redo',
			handler:onSave,
	 		cssClass:'glyphicon glyphicon-arrow-right'
		},
		{
			text:'save',
			handler:onSave,
	 		cssClass:'glyphicon glyphicon-floppy-disk'
		},
		{
			text:'tag',
			handler:onSave,
	 		cssClass:'glyphicon glyphicon-tag'
		},
		{
			text:'history',
			handler:onSave,
	 		cssClass:'glyphicon glyphicon-time'
		},
		{
			text:'delete',
			handler:onSave,
	 		cssClass:'glyphicon glyphicon-remove'
		}];
	 
	 $scope.actions = actions;
	 $scope.$emit('editor_loaded', actions);
	 console.log('operation_edit controller loaded');
	 
	 $scope.aceLoaded = function(){
		 
	 };
	 
	 $scope.aceChanged = function(){
		 
	 };
	 
}]);
