// JavaScript source code
var myApp = angular.module('myApp', ['ngMaterial']);

myApp.controller('UpdateUser', function ($scope, $http, $timeout) {

    	$http.get('/user/profile').then(function (response) {
        	console.log("I got the data");
        	$scope.user = response.data;
    	});


});