"use strict";
(function () {
	var stateName = 'viewTransaction';
	angular
		.module(stateName, ['ui.router', 'formly', 'formlyBootstrap', 'transactionsDataService'])
		.config(stateConfig)
		.directive(stateName, directive)

	function stateConfig($stateProvider) {
		$stateProvider
			.state(stateName, {
				url: '/transactions/view/:id',
				template: '<view-transaction></view-transaction>'
			});
	}


	function directive() {
		return {
			templateUrl: 'app/states/transactions/view/transactions.view.html',
			controller: controller,
			controllerAs: stateName,
			bindToController: true,
			scope: {}
		}
	}

	function controller($state, transactionsDataService) {
		var vm = this;
		vm.title = "The Transaction";

		vm.fields = [
			{
				key: '_id',
				type: 'input',
				templateOptions: {
					label: 'Id',
					placeholder: 'transaction id',
					required: true,
					type: 'text'
				}
            },
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

		vm.updateTransaction = function () {
			transactionsDataService
				.updating(vm.transaction)
				.then(function () {
					$state.go('listTransactions');
				});
		}

		function init() {
			vm.transaction = transactionsDataService.getting($state.params.id);
		}

		init();
	}


})();
