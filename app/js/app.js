'use strict';

/* App Module */

var ideControllers = angular.module('ideControllers', []);

var ideApp = angular.module('ideApp', [
  'ui.bootstrap',
  'ngAnimate',
  'ideControllers',
  'ideServices',
  'angularBootstrapNavTree',
  'ui.ace',
  'ui.jsPlumb',
  'ngDragDrop',
  'happn',
  'ngLoadScript',
  'cfp.hotkeys'
]);

ideApp.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});

ideApp.directive ('compileHtml', function($compile) {
	return  {
	  restrict: 'A',
	  scope: { compileHtml : '=' },
	  replace: true,
	  link: function (scope, element, attrs) {
		  console.log(element);
		  console.log(element);

		  scope.$watch('compileHtml', function(html) {
			  element.html(html);
			  $compile(element.contents())(scope.$parent.$parent);
		  });
	  }
	}});

// var registerFirebaseService = function (serviceName) {
// 	ideApp.factory(serviceName, function (angularFire) {
//         var _url = null;
//         var _ref = null;

//         return {
//             init: function (url, force) {
//             	if (_url == null || force)
//             	{
//             		_url = url;
//                     _ref = new Firebase(_url);
//             	}
//             },
//             setToScope: function (scope, localScopeVarName) {
//                 angularFire(_ref, scope, localScopeVarName);
//             },
//             traverse:function(data, path, done){
//             	try
//             	{
//             		var currentNode = data;
//             		var found = false;

//             		if (path[0] == '/')
//             			path = path.substring(1, path.length);

//                 	path.split('/').map(function(current, index, arr){
//                 		currentNode = currentNode[current];
//                 		if (index + 1 == arr.length && currentNode){
//                 			found = true;
//                 			done(null, currentNode);
//                 		}
//                 	});

//                 	if (!found)
//                 		done(null, null);
//             	}catch(e){
//             		done(e);
//             	}

//             }
//         };
//     });
// };

var registerDataService = function (serviceName) {
  ideApp.factory(serviceName, function (happnClient) {
        var _happn = null;

        return {
            instance:happnClient,
            init: function (host, port, username, password, done) {
              happnClient.connect(host, port, username, password, done);
            },
            traverse:function(data, path, done){
              try
              {
                var currentNode = data;
                var found = false;

                if (path[0] = '/')
                  path = path.substring(1, path.length);

                  path.split('/').map(function(current, index, arr){
                    currentNode = currentNode[current];
                    if (index + 1 == arr.length && currentNode){
                      found = true;
                      done(null, currentNode);
                    }
                  });

                  if (!found)
                    done(null, null);
              }catch(e){
                done(e);
              }

            }
        };
    });
};

registerDataService('dataService');

//registerFirebaseService('dataService');

ideApp.factory('AppSession', function($rootScope) {
	  return {
		  //currently what path are we editing
	    currentPath: '',
	    //data that is being currently edited, keyed by the path of the item
	    dirty:{},
	    //used rootscope to push an event throughout the app
	    broadcastEvent: function(event, args) {
	      $rootScope.$broadcast(event, args);
	    },
	    defaultDirectiveCode:'LyoNCg0KVGhlIHByb2Mgb2JqZWN0IGdpdmVzIHlvdSBhY2Nlc3MgdG8gc3lzdGVtIGhlbHBlciBmdW5jdGlvbnMuDQpUaGUgcGFyYW1zIGFyZSB0aGUgcGFyYW1ldGVycyBwYXNzZWQgaW50byB0aGlzIG9wZXJhdGlvblQNClRoZSBsaW5lIGlzIHRoZSByYXcgbGluZSB0byBiZSBwcm9jZXNzZWQNCkFmdGVyIHRoZSBsaW5lIGhhcyBiZWVuIHRyYW5zZm9ybWVkIG9yIGNoZWNrZWQsIHRoZSBjYWxsYmFjayBpcyBpbnZva2VkIHRvIHBhc3MgdGhlIGxpbmUgYWxvbmcgdGhlIHByb2Nlc3MNCiovDQoNCmZ1bmN0aW9uIHBlcmZvcm0ocHJvYywgcGFyYW1zLCBsaW5lLCBjYWxsYmFjayl7DQogICAgDQogICAgY2FsbGJhY2soJ09LJywgbGluZSk7DQp9',
	    defaultControlCode:'PCEtLSBUaGlzIGlzIHRoZSBzb3VyY2UgZm9yIHlvdXIgY29udHJvbHMsIGFzIHlvdSBjYW4gc2VlIHdlIGFyZSB1c2luZyBuZy1tb2RlbCB0byBsaW5rIHRoZSB1c2VyIGlucHV0IHRvIHRoZSBhY3R1YWwgcGFyYW1ldGVycyB1c2VkIGZvciB0aGUgb3JjaGVzdHJhdGlvbiAtLT4NCg0KPGZvcm0gY2xhc3M9ImZvcm0taG9yaXpvbnRhbCIgcm9sZT0iZm9ybSI+DQogIDxkaXYgY2xhc3M9ImZvcm0tZ3JvdXAiPg0KICAgPGxhYmVsIGZvcj0iY29udHJvbFBhcmFtMSIgY2xhc3M9ImNvbC1zbS0yIGNvbnRyb2wtbGFiZWwiPlBhcmFtZXRlciAxPC9sYWJlbD4NCiAgIDxkaXYgY2xhc3M9ImNvbC1zbS0xMCI+DQogICAgICA8aW5wdXQgY2xhc3M9ImZvcm0tY29udHJvbCIgaWQ9ImNvbnRyb2xQYXJhbTEiIHBsYWNlaG9sZGVyPSJOYW1lIiBuZy1tb2RlbD0icGFyYW1zLlBhcmFtMSI+PC9pbnB1dD4NCiAgICA8L2Rpdj4NCiAgPC9kaXY+DQogICA8ZGl2IGNsYXNzPSJmb3JtLWdyb3VwIj4NCiAgIDxsYWJlbCBmb3I9ImNvbnRyb2xQYXJhbTIiIGNsYXNzPSJjb2wtc20tMiBjb250cm9sLWxhYmVsIj5QYXJhbWV0ZXIgMjwvbGFiZWw+DQogICA8ZGl2IGNsYXNzPSJjb2wtc20tMTAiPg0KICAgICAgPGlucHV0IGNsYXNzPSJmb3JtLWNvbnRyb2wiIGlkPSJjb250cm9sUGFyYW0yIiBwbGFjZWhvbGRlcj0iTmFtZSIgbmctbW9kZWw9InBhcmFtcy5QYXJhbTIiPjwvaW5wdXQ+DQogICAgPC9kaXY+DQogIDwvZGl2Pg0KIDwvZm9ybT4='
	  };
	});

