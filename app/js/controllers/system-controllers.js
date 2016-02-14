'use strict';

ideControllers.controller('BaseController', ['$scope', '$modal', '$log', '$sce', 'dataService', '$rootScope', function($scope, $modal, $log, $sce, dataService, $rootScope) {

	$rootScope.data = {
		cache:{
			'Projects':{

			},
			'Deployments':{

			},
			'Personnel':{

			}
		},
		message:{
			message:'',
			display:'none',
			type:'alert-info'
		},
		templatePath:''
	}

	$rootScope.updateData = function(item){
		console.log('updating data:::', item);

		if (item.type == 'Project')
			return $rootScope.addProject(item);

		if (item.type == 'Control'){
			//return $rootScope.addCachedItem($rootScope.data.cache.Projects, 'Project', item);

		}


	}

	$rootScope.addProject = function(project){

		project.Operations = {};
		project.Controls = {};
		project.Shapes = {};

		return $rootScope.data.cache.Projects[project.name] = project;
	}

	$rootScope.openModal = function (templatePath, controller, handler, args) {

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

	$rootScope.openNewModal = function (type, action) {

		 var handler = {
				 saved:function(result){
				 	$rootScope.updateData(result);
				 },
				 dismissed:function(){
					 $log.info('Modal dismissed at: ' + new Date());
				 }
		 };

		 var controller = type + '_' + action;
		 return $scope.openModal('../templates/' + controller + '.html', controller, handler);
	};

	$rootScope.to_trusted = function(html_code) {
		  return $sce.trustAsHtml(html_code);
	};

	$rootScope.toArray = function(items){
		  var returnArray = [];
		  for (var item in items)
			  returnArray.push(item);
		  return returnArray;
	};

	$rootScope.getArray = function(items){
		var returnArray = [];
		for (var itemName in items)
			  returnArray.push(itemName);
		return returnArray;
	};

	$rootScope.addCachedItem = function(cacheLocation, type, item){
		cacheLocation[item.name] = {_meta:item._meta, name:item.name, description:item.description, type:type};
	}

	$rootScope.notify = function(message, type, hide){

		if (!type) type = 'info';
		if (hide) hide = 0;

		$rootScope.data.message.type = 'alert-' + type;
		$rootScope.data.message.message = message;
		$rootScope.data.message.display = 'inline-block';

		$rootScope.$apply();

		if (hide) setTimeout(function(){
			$rootScope.data.message.display = 'none';
		}, hide);
	}

	dataService.init('127.0.0.1', 3000, '_ADMIN', 'happn', function(e){

		if (e) throw e;

		dataService.instance.client.get('/PROJECTS/Project/*', {"criteria":{"type":"Project"}}, function(e, projects){

			projects.map(function(project){
				//cacheLocation, type, item
				$rootScope.addProject(project);
			});

			$rootScope.$apply();

		});

	});


}]);

ideControllers.controller('ContentController', ['$scope', '$rootScope', '$modal', '$log', 'dataService', '$templateCache',
	function($scope, $rootScope, $modal, $log, dataService, $templateCache) {

	  $scope.action_selected = function(action){
		  action.handler();
	  };

	  $scope.$on('editItemSelected', function(event, item) {

	  	//$templateCache.remove('../templates/' + item.type.toLowerCase() + '_edit.html');
	  	$rootScope.data.templatePath = '../templates/blank.html';
		$rootScope.$apply();

		console.log('editItemSelected:::',item);

	  	dataService.instance.client.get(item._meta.path, function(e, data){

	 		if (e) return $scope.notify('error fetching item ' + item._meta.name, 'danger');

	 		$scope[item.type.toLowerCase()] = data;

	 		$rootScope.data.templatePath = '../templates/' + item.type.toLowerCase() + '_edit.html';
			$rootScope.$apply();

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

}]);

ideControllers.controller('TreeController',  ['$scope', '$rootScope', 'dataService',

  function($scope, $rootScope, dataService) {

  	var eventHandlers = {};

  	function contractBranch(branch, done){

  		if (eventHandlers[branch._meta.path] >= 0){
  			dataService.instance.client.off(eventHandlers[branch._meta.path], function(e){

	  			console.log('ds off:::', e);

	  			if (e) return done(e);
	  			delete eventHandlers[branch._meta.path];
	  			done();

	  		});
	  		else done();
  		}

  	}

  	function populateBranch(branch){

  		if (branch.type == 'Project'){

  			dataService.instance.client.on(branch._meta.path + '/*', function(data){
		  		console.log('something happened in the project:::', data);
		  	},
		  	function(e, eventId){
		  		eventHandlers[branch._meta.path] = eventId;
		  	});

  			console.log('GETTING /PROJECTS/' + branch._meta.path + '/*:::');

  			dataService.instance.client.get(branch._meta.path + '/*', function(e, items){
  				console.log('have proj items:::', items);
  				items.map(function(item){
  					$rootScope.data.cache.Projects[branch.name][item.type + 's'][item.name] = item;
  				});

  				$rootScope.$apply();
  			});
  		}

  	}

	$scope.on_expand_or_contract = function(branch) {

		console.log('on_expand_or_contract:::', branch);

		if (branch.expanded)
		{
			$scope.meta.expanded[branch.path] = true;
			populateBranch(branch);
		}
	  	else
	  	{
	  		console.log('contracting:::');
	  		contractBranch(branch, function(e){

	  			if (e)
	  				$rootScope.notify('app failure, attempting to detach from events', 'danger', 5000);

	  			delete $scope.meta.expanded[branch.path];
	  			console.log('contracted ok:::');
	  		});

	  	}
	};

	$scope.my_tree_handler = function(branch) {

		console.log('my tree handler:::');

		$scope.meta.selected = branch.path;
		if (branch._meta)
			 $rootScope.$broadcast('editItemSelected', branch);

	};

	$scope.meta = {expanded:{}, selected:null};
	$scope.ux_treedata = $rootScope.data.cache;

}]);


ideControllers.controller('ModalContentController', ['$scope', '$modal', '$log', 'dataService', function($scope, $modal, $log, dataService) {

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

