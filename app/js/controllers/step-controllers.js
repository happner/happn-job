ideControllers.controller('step_edit', ['$scope', '$uibModalInstance', 'data', 'args', 'dataService', function($scope, $uibModalInstance, data, args, dataService) {

	console.log('step edit:::', args);
	$scope.step = {type: 'Step'};

	function validate(){
	  	return true;
	}

	$scope.ok = function () {

		if (validate())
		{
			$uibModalInstance.close({settings:$scope.step, id:args.id});
		}

	};

	$scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	};

	dataService.instance.client.get(args.control, function(e, control){
		console.log('got control:::', control);
		$scope.html = base64.decode(control.currentCode);
		$scope.$apply();
	});

}]);
