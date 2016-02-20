ideControllers.controller('step_edit', ['$scope', '$modalInstance', 'data', 'args', 'dataService', function($scope, $modalInstance, data, args, dataService) {

	console.log('step edit:::', args);
	$scope.step = {type: 'Step'};

	function validate(){
	  	return true;
	}

	$scope.ok = function () {

		if (validate())
		{
			$modalInstance.close({settings:$scope.step, id:args.id});
		}

	};

	$scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	};

	dataService.instance.client.get(args.control, function(e, control){
		console.log('got control:::', control);
		$scope.html = base64.decode(control.currentCode);
		$scope.$apply();
	});

}]);
