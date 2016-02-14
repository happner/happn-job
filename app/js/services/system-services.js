'use strict';

/* Services */

var ideServices = angular.module('ideServices', []);

ideServices.service('utils', ['$rootScope', function($rootScope) {

	this.toPropertyNameArray = function(obj){
		var returnArray = [];

		for (var prop in obj)
			returnArray.push(prop);
		return returnArray;
	 }

	this.toArray = function(obj){
		var returnArray = [];

	  	for (var prop in obj)
		  returnArray.push(obj[prop]);

		return returnArray;
	}


}]);