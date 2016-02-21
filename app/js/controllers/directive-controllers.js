ideControllers.controller('directive_new', ['$scope', '$uibModalInstance', 'dataService', 'utils', function($scope, $uibModalInstance, dataService, utils) {

	  $scope.directive = {name:'', description:'', project:'', src:'', type: 'Directive'};
	  $scope.utils = utils;

	  $scope.ok = function () {

		if (!$scope.directive.name) return $scope.notify('your directive needs a name', 'warning', 0, true);
		if (!$scope.directive.project) return $scope.notify('your directive needs a project', 'warning', 0, true);

		dataService.instance.client.get($scope.directive.project + '/Directive/*', {criteria:{name:$scope.directive.name}}, function(e, directives){

			if (directives.length > 0) return $scope.notify('an directive with this name already exists', 'warning', 0, true);

			dataService.instance.client.setSibling($scope.directive.project + '/Directive', $scope.directive, function(e, newDirective){

	  			if (e) return $scope.notify('error saving directive: ' + e.toString(), 'danger', 0, true);

	  			$uibModalInstance.close(newDirective);

	  		});

		});

		$uibModalInstance.close($scope.directive);
	}

}]);

ideControllers.controller('directive_edit', ['$scope', 'dataService', 'AppSession', function($scope, dataService, AppSession) {

	if ($scope.directive.currentCode == null)
		$scope.directive.currentCode = AppSession.defaultDirectiveCode;

	$scope.editorCode = base64.decode($scope.directive.currentCode);

 	var onSave = function(args){
		 $scope.directive.currentCode = base64.encode($scope.editorCode);
		 dataService.instance.client.set($scope.directive._meta.path, $scope.directive, {merge:true}, function(e, response){
		 	if (e) $scope.notify('saving directive failed', 'danger');
		 });
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

	$scope.aceLoaded = function(){

	};

	$scope.aceChanged = function(){

	};

	dataService.instance.client.off($scope.directive._meta.path, function(e){
		if (e) return $scope.notify('unable to unattach to system events', 'danger');

		dataService.instance.client.on($scope.directive._meta.path, function(data, _meta){

		 	$scope.notify('directive updated', 'info');
		 	$scope.editorCode = base64.decode(data.currentCode);

		 }, function(e){

		 	if (e) return $scope.notify('unable to attach to system events', 'danger');

		 });
	});

}]);
