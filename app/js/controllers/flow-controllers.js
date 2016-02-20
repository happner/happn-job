
ideControllers.controller('flow_new', ['$scope', '$modalInstance', 'dataService', 'utils',
    function ($scope, $modalInstance, dataService, utils) {

        $scope.utils = utils;

        $scope.flow = {
            name: '',
            description: '',
            project: '',
            type: 'Flow'
        };

        $scope.ok = function(){

            if (!$scope.flow.name) return $scope.notify('your assembly line needs a name', 'warning', 0, true);
            if (!$scope.flow.project) return $scope.notify('your assembly line needs a project', 'warning', 0, true);

            dataService.instance.client.get($scope.flow.project + '/Flow/*', {criteria:{name:$scope.flow.name}}, function(e, flows){

                if (flows.length > 0) return $scope.notify('an assembly line with this name already exists', 'warning', 0, true);

                dataService.instance.client.setSibling($scope.flow.project + '/Flow', $scope.flow, function(e, newFlow){

                    if (e) return $scope.notify('error saving flow: ' + e.toString(), 'danger', 0, true);

                    $modalInstance.close(newFlow);

                });

            });

        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }
]);

ideControllers.controller('flow_edit', ['$scope','dataService', 'utils',
    function ($scope, dataService, utils) {

        $scope.drawingMethod = {};
        $scope.shapeCounters = {};

        if ($scope.flow.drawing){
            $scope.flow.drawing.shapes.map(function(shape){
                if (!$scope.shapeCounters[shape])
                    $scope.shapeCounters[shape] = 1;

                $scope.shapeCounters[shape]++;
            });
        }

        $scope.addShape = function(shape, x, y){

            console.log('adding shape:::', shape);

            if (!$scope.shapeCounters[shape.name])
                $scope.shapeCounters[shape.name] = 1;
            else
                $scope.shapeCounters[shape.name]++;

            var shapeId = shape.name + '_' + Date.now();

            var shape = {
                control:shape.control,
                project:shape.project,
                directive:shape.directive,
                path:shape.path,
                id: shapeId.replace(/ /g, ''),
                label: shape.name + $scope.shapeCounters[shape.name],
                icon: '',
                sourceEndPoints: [],
                targetEndPoints: [],
                dragdropEndPoints: ["LeftMiddle", "RightMiddle", "TopCenter", "BottomCenter"],
                cssClass: "",
                style: "",
                position: "top:" + y + "px;left:" + x + "px"
            }

            $scope.flow.drawing.shapes.push(shape);
            $scope.$apply();
            $scope.drawingMethod.newShape(shape);
        }


        $scope.onDrop = function ($event, $data) {
            $scope.addShape($data.branch, $event.layerX, $event.layerY);
        };

        $scope.drawingEvent = function (event, params) {

            if (event == "connectionDragStop"){

            	if (params[0].endpoints && params[0].endpoints.length == 2){
            		var endpoints = params[0].endpoints;
					var fromEndPoint = endpoints[0].anchor;
					var toEndPoint = endpoints[1].anchor;

					var connection = {uuids:[fromEndPoint.elementId.replace('flowchart','') + fromEndPoint.type, toEndPoint.elementId.replace('flowchart','') + toEndPoint.type], editable:true};
					console.log(connection);

					$scope.flow.drawing.connections.push(connection);
            	}
			}

            if (event == "shape-clicked"){

                var handler = {
                     saved:function(result){
                        console.log('step updated:::', result);
                     },
                     dismissed:function(){

                     }
                };

                return $scope.openModal('../templates/step_edit.html', 'step_edit', handler, params);
            }
        }

        $scope.shapeEdit = function(shape) {
            console.log('shape edit called');
        }

        if ($scope.flow.drawing == null) {

            $scope.flow.drawing = {
            	id:'sector_0_0',
                styles: {},
                shapeClass: 'window',
                shapes: [],
                connections: [],
                config: {
                    DragOptions: {
                        cursor: 'pointer',
                        zIndex: 2000
                    },
                    ConnectionOverlays: [
                        ["PlainArrow", {
                            location: 1,
                            width: 15,
                            length: 15
                        }]
                    ]
                }
            }
        }

        $scope.getArray = function (items) {
            var returnArray = [];
            for (var itemName in items)
                returnArray.push(itemName);
            return returnArray;
        };

        $scope.projectSelected = function () {

            if ($scope.flow.project) {

            } else {

            }
        }

        var onSave = function (args) {
            dataService.instance.client.set($scope.flow._meta.path, angular.copy($scope.flow), {merge:true}, function(e, response){
                console.log(e);
                if (e) $scope.notify('saving flow failed', 'danger');
            });
        };

        var onDelete = function (args) {

        };

        var onToggleProperties = function (args) {
            if (!$scope.collapsed)
            	$scope.collapsed = false;
            else
            	$scope.collapsed = true;
        };

        var actions = [{
            text: 'properties',
            handler: onToggleProperties,
            cssClass: 'glyphicon glyphicon-align-justify'
        },{
            text: 'save',
            handler: onSave,
            cssClass: 'glyphicon glyphicon-floppy-disk'
        },{
            text: 'delete',
            handler: onDelete,
            cssClass: 'glyphicon glyphicon-remove'
        }];

        $scope.actions = actions;
        $scope.$emit('editor_loaded', actions);

        dataService.instance.client.off($scope.flow._meta.path, function(e){
        if (e) return $scope.notify('unable to unattach to system events', 'danger');

        dataService.instance.client.on($scope.flow._meta.path, function(data, _meta){

            $scope.notify('flow updated', 'info');

         }, function(e){

            if (e) return $scope.notify('unable to attach to system events', 'danger');

         });
    });

    }
]);