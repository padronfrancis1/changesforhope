var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function($stateProvider, $urlRouterProvider){

	$urlRouterProvider.otherwise('/Clients');
	$stateProvider

	.state('Clients', {
		url: '/Clients',
		templateUrl: 'ClientsSection.html',
		controller: 'ClientsController',
		controllerAs: 'clients'
	})
	.state ('Details', {
		url: '/Details',
		templateUrl: 'DetailsSection.html'
	});

});





myApp.controller('ClientsController', ['ClientsFactory', function(ClientsFactory){


	
	ClientsFactory.ClientsFactoryObj;

}]);

myApp.factory('ClientsFactory', [function ClientsFactoryClass(){
	

	var ClientsFactoryObj = {};

	ClientsFactoryObj.test = function() {
		console.log("test");
	}



	return ClientsFactoryObj.test();


}]);