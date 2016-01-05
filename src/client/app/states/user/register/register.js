"use strict";
(function () {
	/** component state to register a new user */
	var componentName = "register";
	angular
		.module(componentName, ['ui.router', 'form-messages'])
		.config(stateConfig)
		.directive(componentName, directive)

	function stateConfig($stateProvider) {
		$stateProvider
			.state(componentName, {
				url: '/' + componentName,
				template: '<register></register>'
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
		/** checks for error in a field */
		vm.has_error = function (form, field) {
				return (form.$submitted || field.$touched) && field.$invalid;
			}
			/** submits the form via angularjs */
		vm.submit = function () {
			vm.form.$submitted = true;
			if (vm.form.$valid) {
				var user = usersDataService.newUser(vm.email, vm.password);
				usersDataService.postingUser(user)
					.then(function (result) {
						$state.go('profile');
					}, function (err) {
						vm.form.token.$error.conflict = true;
					})
			}
		}
	}
})();
