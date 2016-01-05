"use strict";
(function () {
	var stateName = 'listTransactions';
	angular
		.module(stateName, ['ui.router', 'transactionsDataService'])
		.config(stateConfig)
		.directive(stateName, directive)

	function stateConfig($stateProvider) {
		$stateProvider
			.state(stateName, {
				url: '/transactions/list/',
				template: '<list-transactions></list-transactions>'
			});
	}


	function directive() {
		return {
			templateUrl: 'app/states/transactions/list/transactions.list.html',
			controller: controller,
			controllerAs: stateName,
			bindToController: true,
			scope: {}
		}
	}

	function controller($state, transactionsDataService) {
		var vm = this;
		vm.title = "The Transactions";


		function init() {
			vm.transactions = transactionsDataService.querying();
		}

		init();
	}


})();
