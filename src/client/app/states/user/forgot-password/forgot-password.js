"use strict";
(function () {
	/** component state to register a new user */
	var componentName = "forgot-password";
	var componentPascalName = "forgotPassword";
	angular
		.module(componentName, ['ui.router', 'form-messages'])
		.config(config)
		.directive(componentPascalName, directive)

	function config($stateProvider) {
		$stateProvider
			.state(componentPascalName, {
				url: '/' + componentName,
				template: '<forgot-password></forgot-password>'
			});
	}

	function directive() {
		return {
			templateUrl: 'app/states/user/' + componentName + '/' + componentName + '.html',
			controller: controller,
			controllerAs: componentPascalName,
			bindToController: true
		}
	}

	function controller() {
		var vm = this;

		vm.has_error = function (form, field) {
			return (form.$submitted || field.$touched) && field.$invalid;
		}

		vm.submit = function (form) {
			form.$submitted = true;
			if (form.$valid) {
				console.log("do something");
			}
		}
	}
})();
