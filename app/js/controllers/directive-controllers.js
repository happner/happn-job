ideControllers.controller('directive_new', ['$scope', '$uibModalInstance', 'dataService', 'utils', function($scope, $uibModalInstance, dataService, utils) {

	var controllerSettings = {
		parentPropertyName:'project',
		parentType:'Project',
		directiveTypeName:'Directive'
	}

	$scope.directive = {name:'', description:'', src:''};
	$scope.directive.type = controllerSettings.directiveTypeName;
	$scope.directive[controllerSettings.parentPropertyName] = '';

	$scope.init = function(settings){
		controllerSettings = angular.extend(controllerSettings, settings);
		console.log('doing ng init:::', controllerSettings);
		$scope.directive.type = controllerSettings.directiveTypeName;
		$scope.directive[controllerSettings.parentPropertyName] = '';
	}

	$scope.utils = utils;

	$scope.ok = function () {

		if (!$scope.directive.name) return $scope.notify('your directive needs a name', 'warning', 0, true);
		if (!$scope.directive[controllerSettings.parentPropertyName]) return $scope.notify('your directive needs a ' + controllerSettings.parentPropertyName, 'warning', 0, true);

		dataService.instance.client.get($scope.directive[controllerSettings.parentPropertyName] + '/' + controllerSettings.directiveTypeName + '/*', {criteria:{name:$scope.directive.name}}, function(e, directives){

			if (directives.length > 0) return $scope.notify('an directive with this name already exists', 'warning', 0, true);

			dataService.instance.client.setSibling($scope.directive[controllerSettings.parentPropertyName] + '/' + controllerSettings.directiveTypeName, $scope.directive, function(e, newDirective){

	  			if (e) return $scope.notify('error saving directive: ' + e.toString(), 'danger', 0, true);

	  			console.log('saved new directiive:::', newDirective);
	  			$uibModalInstance.close(newDirective);

	  		});

		});

		//$uibModalInstance.close($scope.directive);
	}

}]);

ideControllers.controller('directive_edit', ['$scope', 'dataService', 'AppSession', function($scope, dataService, AppSession) {

	console.log('scope gen:::', $scope.generator);

	var controllerSettings = {
		parentPropertyName:'project',
		parentType:'Project',
		directiveTypeName:'Directive',
		obj:'directive'
	}

	$scope.aceLoaded = function(){

	};

	$scope.aceChanged = function(){

	};

	$scope.propertiesVisible = false;

	$scope.editorSetup = {
	  useWrapMode : true,
	  showGutter: true,
	  theme:'eclipse',
	  mode: 'javascript',
	  onLoad: 'aceLoaded',
	  onChange: 'aceChanged'
	}

	var onToggleProperties = function (args) {
        $scope.propertiesVisible = !$scope.propertiesVisible;
        console.log('MADE VISIBLE:::', $scope.propertiesVisible);
        //$scope.$apply();
    };

	var initDirective = function(){
		if ($scope.directive.currentCode == null)
			$scope.directive.currentCode = AppSession.defaultDirectiveCode;

		$scope.editorCode = base64.decode($scope.directive.currentCode);

		dataService.instance.client.off($scope.directive._meta.path, function(e){
			if (e) return $scope.notify('unable to unattach to system events', 'danger');

			dataService.instance.client.on($scope.directive._meta.path, function(data, _meta){

			 	$scope.notify('directive updated', 'info');
			 	$scope.editorCode = base64.decode(data.currentCode);

			 }, function(e){

			 	if (e) return $scope.notify('unable to attach to system events', 'danger');

			 });
		});
	}

	$scope.init = function(settings){
		controllerSettings = angular.extend(controllerSettings, settings);
		console.log('doing ng init:::', controllerSettings);

		$scope.directive = $scope[settings.obj];

		if ($scope.directive.mode)
			$scope.editorSetup.mode = $scope.directive.mode;

		$scope.directive.type = controllerSettings.directiveTypeName;
		$scope.directive[controllerSettings.parentPropertyName] = '';

		initDirective();
	}

	$scope.updateMode = function(){
		console.log('updating mode');
		$scope.editorSetup.mode = $scope.directive.mode;
	}

	if ($scope.directive){
		initDirective();
	}

 	var onSave = function(args){
		 $scope.directive.currentCode = base64.encode($scope.editorCode);
		 dataService.instance.client.set($scope.directive._meta.path, $scope.directive, {merge:true}, function(e, response){
		 	if (e) $scope.notify('saving directive failed', 'danger');
		 });
	};

	var actions = [
	{
        text: 'properties',
        handler: onToggleProperties,
        cssClass: 'glyphicon glyphicon-align-justify'
    },
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

}]);
