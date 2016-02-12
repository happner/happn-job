ideControllers.controller('step_edit', ['$scope', '$modalInstance', 'data', 'args', 'dataService', function($scope, $modalInstance, data, args, dataService) {

	console.log('step edit:::', args);

	$scope.data = data;
	$scope.message = {type:'alert-warning', message:'', display:'none'};
	$scope.step = {name:'', description:'', project:'', src:'', type: 'shape', editable:true};

	var showMessage = function(type, message){
		  $scope.message.type = type;
		  $scope.message.message = message;
		  $scope.message.display = 'block';
	};

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

	dataService.traverse(data, args.path, function(e, shape){
		if (!e){
			console.log('shape:::', shape);
			dataService.traverse(data, '/Projects/' + shape.meta.project + '/Controls/' + shape.meta.control, function(e, control){
				if (!e){
					console.log('control:::', control);
					dataService.traverse(data, '/Projects/' + shape.meta.project + '/Operations/' + shape.meta.operation, function(e, operation){
						if (!e){
							console.log('operation:::', operation);
							$scope.html = base64.decode(control.meta.currentCode);
						}
					})
				}
			})
		}
	})

}]);
