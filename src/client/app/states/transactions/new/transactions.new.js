"use strict";
(function () {
	var stateName = 'newTransaction';
	angular
		.module(stateName, ['ui.router', 'formly', 'formlyBootstrap', 'transactionsDataService'])
		.config(stateConfig)
		.directive(stateName, directive)

	function stateConfig($stateProvider) {
		$stateProvider
			.state(stateName, {
				url: '/transactions/new',
				template: '<new-transaction></new-transaction>'
			});
	}


	function directive() {
		return {
			templateUrl: 'app/states/transactions/new/transactions.new.html',
			controller: controller,
			controllerAs: stateName,
			bindToController: true,
			scope: {}
		}
	}

	function controller($state, transactionsDataService) {
		var vm = this;
		vm.title = "New Transaction";

		vm.fields = [
			{
				key: 'type',
				type: 'input',
				templateOptions: {
					label: 'Type',
					placeholder: 'income or expense',
					required: true,
					type: 'text'
				}
            },
			{
				key: 'category',
				type: 'input',
				templateOptions: {
					label: 'Category',
					placeholder: 'transaction category',
					required: true,
					type: 'text'
				}
            }, {
				key: 'date',
				type: 'input',
				templateOptions: {
					label: 'Date',
					required: false,
					type: 'date'
				}
            }, {
				key: 'amount',
				type: 'input',
				templateOptions: {
					label: 'Amount',
					placeholder: 'amount in euros',
					required: true,
					type: 'number'
				}
            },
        ]

		vm.saveTransaction = function () {
			transactionsDataService
				.saving(vm.transaction)
				.then(function () {
					$state.go('listTransactions');
				});
		}

		function init() {
			vm.transaction = transactionsDataService.new();
			vm.transaction.type = "Income";
			vm.transaction.date = new Date();
			vm.transaction.amount = 0;
		}

		init();
	}


})();
