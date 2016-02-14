ideControllers.controller('control_new', ['$scope', '$modalInstance', 'dataService', 'utils', function($scope, $modalInstance, dataService, utils) {

	$scope.control = {
		name:'',
		description:'',
		project:''
	}

	$scope.utils = utils;

	console.log('$scope.projects:::',$scope.projects);

	$scope.ok = function(){
		console.log('$scope.control:::',$scope.control);
	}

	 //  $scope.data = data;
	 //  $scope.message = {type:'alert-warning', message:'', display:'none'};
	 //  $scope.control = {name:'', description:'', project:'', src:'', type: 'control', editable:true};


	 //  $scope.ok = function () {

		// console.log('$scope.data');
		// console.log($scope.data);

		// console.log('$scope.control');
		// console.log($scope.control);

		// var controlObj = {meta: $scope.control};
		// var okToSave = false;

		// if ($scope.data.Projects[$scope.control.project]['Controls'] == null)
		// {
		// 	$scope.data.Projects[$scope.control.project]['Controls'] = {};
		// 	okToSave = true;
		// }
		// else
		// {
		// 	if ($scope.data.Projects[$scope.control.project]['Controls'][$scope.control.name] != null)
		// 		showMessage('alert-warning', 'A control by this name already exists');
		// 	else
		// 	{
		// 		okToSave = true;
		// 	}
		// }

		// if (okToSave)
		// {
		// 	$scope.data.Projects[$scope.control.project]['Controls'][$scope.control.name] = controlObj;
		// 	$modalInstance.close('New project added OK');
		// }

	 //  };

	 //  $scope.cancel = function () {
	 //    $modalInstance.dismiss('cancel');
	 //  };

}]);

ideControllers.controller('control_edit', ['$scope', 'dataService', 'AppSession', function($scope, dataService, AppSession) {

	 if ($scope.editData.meta.currentCode == null)
		 $scope.editData.meta.currentCode = AppSession.defaultControlCode;

	 $scope.editorCode = base64.decode($scope.editData.meta.currentCode);

	 console.log('Loaded new control_edit!!!');

	 var test = 'blah';

	 var onSave = function(args){
		 console.log('onSave clicked ');
		 console.log($scope.editData);

		 $scope.editData.meta.currentCode = base64.encode($scope.editorCode);
	 };

	 var onPreview = function(args){
		 console.log('onPreview clicked ');

		 $scope.openModal('../templates/control_view.html', 'control_view', null, {view_html:$scope.to_trusted($scope.editorCode)});
	 };

	 var actions = [
	    {
	    	text:'preview',
	    	handler:onPreview,
	    	cssClass:'glyphicon glyphicon-eye-open'
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
	 console.log('control_edit controller loaded');

	 $scope.aceLoaded = function(){

	 };

	 $scope.aceChanged = function(){

	 };

}]);

ideControllers.controller('control_view', ['$scope', '$modalInstance','$rootScope', 'dataService', 'AppSession', 'args', 'ideHelper', function($scope, $modalInstance, $rootScope, dataService, AppSession, args, ideHelper) {
	dataService.setToScope($scope, 'data');
	$scope.view_html = args.view_html;
	$scope.params = {Param1:'Test',Param2:'Test'};
	$scope.helper = ideHelper;

	$scope.ok = function(){
		if (args.okHandler != null)
			args.okHandler($modalInstance);
		else
		{

			$modalInstance.close('Control viewed OK');
			console.log($scope.params);
		}

	};

	$scope.cancel = function(){
		if (args.cancelHandler != null)
			args.cancelHandler($modalInstance);
		else
			$modalInstance.close('Control viewed OK');
	};

}]);

