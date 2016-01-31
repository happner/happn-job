ideControllers.controller('shape_new', ['$scope', '$modalInstance', 'data', function($scope, $modalInstance, data) {

	  $scope.data = data;  
	  $scope.message = {type:'alert-warning', message:'', display:'none'};
	  $scope.shape = {name:'', description:'', project:'', src:'', type: 'shape', editable:true}; 

	  $scope.controls = {};
	  $scope.operations = {};

	  var showMessage = function(type, message){
		  $scope.message.type = type;
		  $scope.message.message = message;
		  $scope.message.display = 'block';
	  };
	  
	  $scope.getArray = function(items){
		  var returnArray = [];
		  for (var itemName in items)
			  returnArray.push(itemName);
		  return returnArray;
	  };
	  
	  $scope.projectSelected = function(){
	  	if ($scope.shape.project){
	  		$scope.controls = data.Projects[$scope.shape.project].Controls;
	  		$scope.operations = data.Projects[$scope.shape.project].Operations;
	  	}else{
	  		$scope.controls = {};
	  		$scope.operations = {};
	  	}
	  }

	  $scope.ok = function () {
		  
		console.log('$scope.data');
		console.log($scope.data);
		
		console.log('$scope.shape');
		console.log($scope.shape);
		
		var shapeObj = {meta: $scope.shape};
		var okToSave = false;
		
		if ($scope.data.Projects[$scope.shape.project]['Shapes'] == null)
		{
			$scope.data.Projects[$scope.shape.project]['Shapes'] = {};
			okToSave = true;
		}
		else
		{
			if ($scope.data.Projects[$scope.shape.project]['Shapes'][$scope.shape.name] != null)
				showMessage('alert-warning', 'A shape by this name already exists');
			else
			{
				okToSave = true;
			}
		}
		
		if (okToSave)
		{
			$scope.data.Projects[$scope.shape.project]['Shapes'][$scope.shape.name] = shapeObj;
			$modalInstance.close('New shape added OK');
		}
			
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };
	  
}]);

ideControllers.controller('shape_edit', ['$scope', function($scope) {

	 console.log('$scope.editData');
	 console.log($scope.editData);
	 
	 $scope.shape =  angular.copy($scope.editData.meta);

	 $scope.getArray = function(items){
		  var returnArray = [];
		  for (var itemName in items)
			  returnArray.push(itemName);
		  return returnArray;
	  };
	  
	  $scope.projectSelected = function(){

	  	console.log($scope.data);

	  	if ($scope.shape.project){
	  		$scope.controls = $scope.data.Projects[$scope.shape.project].Controls;
	  		$scope.operations = $scope.data.Projects[$scope.shape.project].Operations;
	  	}else{
	  		$scope.controls = {};
	  		$scope.operations = {};
	  	}
	  }


	 var onSave = function(args){
		 console.log('onSave clicked ');
		 console.log($scope.editData);
		 
		 $scope.editData.meta = $scope.shape;
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
	 
	 $scope.projectSelected();

	 $scope.actions = actions;
	 $scope.$emit('editor_loaded', actions);
	 console.log('shape_edit controller loaded');
	 
}]);
