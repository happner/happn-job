'use strict';

ideControllers.controller('BaseController', ['$scope', '$modal', '$log', '$sce', 'dataService', '$rootScope', function($scope, $modal, $log, $sce, dataService, $rootScope) {

	$rootScope.data = {
		treeNav:{
			'Projects':{

			},
			'Shapes':{

			}
		}

	}

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

	dataService.init('127.0.0.1', 3000, '_ADMIN', 'happn', function(e){

		if (e) throw e;

		dataService.instance.client.get('/Project/*', function(e, projects){

			projects.map(function(project){
				console.log('adding proj');
				$rootScope.data.treeNav.Projects[project.name] = project;
			});

			$rootScope.$apply();

		});

	});


}]);

/* Controllers */
ideControllers.controller('TreeController',  ['$scope', '$rootScope', 'dataService',

  function($scope, $rootScope, dataService) {

	$scope.on_expand_or_contract = function(branch) {
		if (branch.expanded)
		{
			$scope.meta.expanded[branch.path] = true;
		}
	  	else
	  	{
	  		delete $scope.meta.expanded[branch.path];
	  	}
	};

	$scope.my_tree_handler = function(branch) {

		$scope.meta.selected = branch.path;
		if (branch._meta)
			 $rootScope.$broadcast('editItemSelected', branch);

	};

	$scope.meta = {expanded:{}, selected:null};
	$scope.ux_treedata = $rootScope.data.treeNav;

}]);

ideControllers.controller('ContentController', ['$scope', '$modal', '$log', 'dataService',
	function($scope, $modal, $log, dataService) {

	  $scope.action_selected = function(action){
		  action.handler();
	  };

	  $scope.$on('editItemSelected', function(event, item) {

			$scope.editData = item;
			$scope.templatePath = '../templates/' + item.type.toLowerCase() + '_edit.html';
			$scope.eventArgs = item;
			$scope.$apply();

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

