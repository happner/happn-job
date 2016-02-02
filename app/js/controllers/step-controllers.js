ideControllers.controller('step_edit', ['$scope', '$modalInstance', 'data', function($scope, $modalInstance, data) {

	$scope.click = function(arg) {
	    alert('Clicked ' + arg);
	}
	$scope.html = '<a ng-click="click(1)" href="#">Click me</a>';

	  $scope.data = data;
	  $scope.message = {type:'alert-warning', message:'', display:'none'};
	  $scope.step = {name:'', description:'', project:'', src:'', type: 'shape', editable:true};

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

	  function validate(){
	  	return true;
	  }

	  $scope.ok = function () {

		console.log('$scope.data');
		console.log($scope.data);

		console.log('$scope.step');
		console.log($scope.step);

		okToSave = true;

		if (validate())
		{
			$modalInstance.close('New shape added OK');
		}

	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };

}]);
