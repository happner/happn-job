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

	console.log('our control:::', args);

	dataService.instance.client.get(args.droid, function(e, droid){
		console.log('got droid:::', droid);

		dataService.instance.client.get(droid.control, function(e, control){
			console.log('got control:::', control);
			var html = base64.decode(control.currentCode);
			console.log('got control html:::', html);
			$scope.html = html;
			$scope.$apply();
		});

	});

}]);
