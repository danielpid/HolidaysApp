"use strict";
(function () {
	var stateName = 'transactions';
	angular
		.module(stateName, ['ui.router', 'ngResource', 'newTransaction', 'viewTransaction', 'listTransactions'])
		.config(stateConfig)

	function stateConfig($stateProvider) {
		$stateProvider
			.state(stateName, {
				url: '/' + stateName,
				templateUrl: 'app/states/' + stateName + '/' + stateName + '.html',
			});
	}

})();
