
ideControllers.controller('flow_new', ['$scope', '$modalInstance', 'data',
    function ($scope, $modalInstance, data) {

        $scope.data = data;
        $scope.message = {
            type: 'alert-warning',
            message: '',
            display: 'none'
        };
        $scope.flow = {
            name: '',
            description: '',
            project: '',
            type: 'flow',
            editable: true
        };

        var showMessage = function (type, message) {
            $scope.message.type = type;
            $scope.message.message = message;
            $scope.message.display = 'block';
        };

        $scope.getArray = function (items) {
            var returnArray = [];
            for (var itemName in items)
                returnArray.push(itemName);
            return returnArray;
        };

        $scope.ok = function () {

            console.log('$scope.data');
            console.log($scope.data);

            console.log('$scope.flow');
            console.log($scope.flow);

            var flowObj = {
                meta: $scope.flow
            };
            var okToSave = false;

            if ($scope.data.Projects[$scope.flow.project]['Flows'] == null) {
                $scope.data.Projects[$scope.flow.project]['Flows'] = {};
                okToSave = true;
            } else {
                if ($scope.data.Projects[$scope.flow.project]['Flows'][$scope.flow.name] != null)
                    showMessage('alert-warning', 'A flow by this name already exists');
                else {
                    okToSave = true;
                }
            }

            if (okToSave) {
                $scope.data.Projects[$scope.flow.project]['Flows'][$scope.flow.name] = flowObj;
                $modalInstance.close('New flow added OK');
            }

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }
]);

ideControllers.controller('flow_edit', ['$scope',
    function ($scope) {

        console.log('$scope.editData');
        console.log($scope.editData);

        $scope.flow = angular.copy($scope.editData.meta);
        $scope.drawingMethod = {};
        $scope.shapeCounters = {};

        $scope.onDrop = function ($event, $data) {

            console.log('onDrop happened');
            console.log($event);
            console.log($data);

            if (!$scope.shapeCounters[$data.branch.meta.name])
                $scope.shapeCounters[$data.branch.meta.name] = 1;
            else
                $scope.shapeCounters[$data.branch.meta.name]++;

            var shapeId = $data.branch.meta.name + $scope.shapeCounters[$data.branch.meta.name];

            var shape = {
                id: shapeId.replace(/ /g, ''),
                label: shapeId,
                icon: '',
                sourceEndPoints: [],
                targetEndPoints: [],
                dragdropEndPoints: ["LeftMiddle", "RightMiddle", "TopCenter", "BottomCenter"],
                cssClass: "",
                style: "",
                position: "top:" + $event.layerY + "px;left:" + $event.layerX + "px"
            }

            $scope.flow.drawing.shapes.push(shape);
            $scope.$apply();
            $scope.drawingMethod.newShape(shape);

        };

        $scope.drawingEvent = function (event, params) {

            console.log('drawing event happened ' + event);
            console.log(params);

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
        }

        if ($scope.flow.drawing == null) {

        	/*
        	 $scope.flow.drawing = {
				id:'drawing1',
				styles:{
				},
				shapeClass:'window',
				shapes:[
					{id:'Window1', 
					 label:'Shape 1', 
					 icon:'', 
					 sourceEndPoints:["LeftMiddle", "RightMiddle"], 
					 targetEndPoints:["TopCenter", "BottomCenter"], 
					 cssClass:"",
					 style:"",
					 position:"top:34em;left:5em"},
					{id:'Window2', 
					 label:'Shape 2', 
					 icon:'', 
					 sourceEndPoints:["LeftMiddle", "BottomCenter"], 
					 targetEndPoints:["TopCenter", "RightMiddle"], 
					 cssClass:"",
					 style:"",
					 position:"top:7em; left:36em;"},
					{id:'Window3', 
					 label:'Shape 3', 
					 icon:'', 
					 sourceEndPoints:["RightMiddle", "BottomCenter"], 
					 targetEndPoints:["LeftMiddle", "TopCenter"], 
					 cssClass:"",
					 style:"",
					 position:"top:27em;left:48em;"},
					{id:'Window4', 
					 label:'Shape 4', 
					 icon:'', 
					 sourceEndPoints:["TopCenter", "BottomCenter"], 
					 targetEndPoints:["LeftMiddle", "RightMiddle"], 
					 cssClass:"",
					 style:"",
					 position:"top:23em; left:22em;"}

				],
				connections:[

					{uuids:["Window2BottomCenter", "Window3TopCenter"], editable:true},
					{uuids:["Window2LeftMiddle", "Window4LeftMiddle"], editable:true},
					{uuids:["Window4TopCenter", "Window4RightMiddle"], editable:true},
					{uuids:["Window3RightMiddle", "Window2RightMiddle"], editable:true},
					{uuids:["Window4BottomCenter", "Window1TopCenter"], editable:true},
					{uuids:["Window3BottomCenter", "Window1BottomCenter"], editable:true}

				],
				config:{
					DragOptions : { cursor: 'pointer', zIndex:2000 },
					// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
					// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
					ConnectionOverlays : [
						[ "PlainArrow", { location:1, width:15, length:15 } ]
					]
				}
			};
			*/


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
        }else
        	console.log($scope.flow.drawing);

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
            console.log('onSave clicked ');
            console.log($scope.editData);

           $scope.editData.meta = $scope.flow;
           $scope.$apply();
           console.log($scope.flow);
        };

        var onDelete = function (args) {
            console.log('onDelete clicked ');
            console.log($scope.editData);

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
        console.log('flow_edit controller loaded');

    }
]);