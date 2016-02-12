'use strict';

/* Controllers */
ideControllers.controller('TreeController',  ['$scope', '$rootScope', 'angularFire', 'dataService', 'AppSession',
  function($scope, $rootScope, angularFire, dataService, AppSession) {

	$scope.on_expand_or_contract = function(branch) {
		if (branch.expanded)
		{
			console.log('branch expanded');
			$scope.meta.expanded[branch.path] = true;
		}
	  	else
	  	{
	  		console.log('branch contracted');
	  		delete $scope.meta.expanded[branch.path];
	  	}
	};

	$scope.my_tree_handler = function(branch) {
		console.log("You selected: " + branch.path);
		console.log(branch);
		$scope.meta.selected = branch.path;

		if (branch.meta && branch.meta.editable == true)
		{
			 $rootScope.$broadcast('editItemSelected', branch);
			 console.log('editItemSelected event happened');
		}

	};

	$scope.meta = {expanded:{}, selected:null};
	$scope.ux_treedata = null;

	dataService.init(AppSession.firebaseURL);
	dataService.setToScope($scope, 'ux_treedata');

	/*
	var ref = new Firebase('https://southbite.firebaseio.com/Fire-grate');
	angularFire(ref, $scope, "ux_treedata");
	*/
}]);

ideControllers.controller('BaseController', ['$scope', '$modal', '$log', '$sce', 'dataService', 'AppSession', 'happnService', function($scope, $modal, $log, $sce, dataService, AppSession, happnService) {

	happnService.init('127.0.0.1', 3000, '_ADMIN', 'happn', function(e){



	});

	//mmm..http://stackoverflow.com/questions/17386820/how-do-i-dynamically-load-multiple-templates-using-angularjs
	  dataService.init(AppSession.firebaseURL);
	  dataService.setToScope($scope, 'data');

	  $scope.openModal = function (templatePath, controller, handler, args) {
		    var modalInstance = $modal.open({
		      templateUrl: templatePath,
		      controller: controller,
		      resolve: {
		        data: function () {
		          return $scope.data;
		        },
		        args: function () {
		          return args;
		        }
		      }
		    });

      if (handler)
    	  modalInstance.result.then(handler.saved, handler.dismissed);
	 };

	 $scope.openNewModal = function (type, action) {

		 var handler = {
				 saved:function(result){
					 $scope.selected = selectedItem;
				 },
				 dismissed:function(){
					 $log.info('Modal dismissed at: ' + new Date());
				 }
		 };

		 return $scope.openModal('../templates/' + action + '.html', action.toString(), handler);
	 };

	 $scope.to_trusted = function(html_code) {
		  return $sce.trustAsHtml(html_code);
	 };

	 $scope.toArray = function(items){
		  var returnArray = [];
		  for (var item in items)
			  returnArray.push(item);
		  return returnArray;
	  };

}]);

ideControllers.controller('ContentController', ['$scope', '$modal', '$log', 'dataService', 'AppSession', function($scope, $modal, $log, dataService, AppSession) {

	  $scope.action_selected = function(action){
		  action.handler();
	  };

	  $scope.$on('editItemSelected', function(event, args) {
		  dataService.traverse($scope.data, args.path, function(e, node){
			  if (!e){
				  $scope.editData = node;
				  $scope.templatePath = '../templates/' + args.meta.type + '_edit.html';
				  $scope.eventArgs = args;
				  $scope.$apply();
				  console.log('applied');
				  console.log($scope.editData);
				  console.log($scope.templatePath);
			  }else{
				  //TODO error handling?
				  throw e;
			  }

		  });
	  });

	  $scope.$on('editor_loaded', function(event, args) {

		  $scope.actions = [];
		  $scope.actions_display = "none";

		  if (event.targetScope.actions != null && event.targetScope.actions.length > 0)
		  {
			  $scope.actions = event.targetScope.actions;
			  $scope.actions_display = "inline";
		  }

	  });


	  /*
	  $scope.$on('$includeContentLoaded', function(event) {
			 console.log('$includeContentLoaded');
			 console.log(event);
			 console.log(event.targetScope);
			 console.log($scope);
			 $scope.actions = event.targetScope.actions;

			 console.log('$scope.actions');
			 console.log($scope.actions);
	  });
	  */
}]);


ideControllers.controller('ModalContentController', ['$scope', '$modal', '$log', 'dataService', 'AppSession', function($scope, $modal, $log, dataService, AppSession) {

	  dataService.init(AppSession.firebaseURL);
	  dataService.setToScope($scope, 'data');

	  $scope.open = function (type, action) {

	    var modalInstance = $modal.open({
	      templateUrl: '../templates/' + action + '.html',
	      controller: action.toString(),
	      resolve: {
	        data: function () {
	          return $scope.data;
	        }
	      }
	    });

	    modalInstance.result.then(function (selectedItem) {
	      $scope.selected = selectedItem;
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	  };
	}]);

