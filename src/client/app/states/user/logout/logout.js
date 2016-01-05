"use strict";
(function () {
	/** component state to register a new user */
	var componentName = "logout";
	angular
		.module(componentName, ['ui.router', 'form-messages'])
		.config(stateConfig)
		.directive(componentName, directive)

	function stateConfig($stateProvider) {
		$stateProvider
			.state(componentName, {
				url: '/' + componentName,
				template: '<logout></logout>'
			});
	}

	function directive() {
		return {
			templateUrl: 'app/states/user/' + componentName + '/' + componentName + '.html',
			controller: controller,
			controllerAs: componentName,
			bindToController: true
		}
	}

	function controller(usersDataService, $state) {
		var vm = this;

	}
})();
