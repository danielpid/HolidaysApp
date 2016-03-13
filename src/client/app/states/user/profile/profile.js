"use strict";
(function () {
	/** component state to view and edit the current user profile */
	var componentName = "profile";
	angular
		.module(componentName, ['ui.router', 'ngStorage', 'provincesDataService', 'ui.select'])
		.config(stateConfig)
		.directive(componentName, directive)

	function stateConfig($stateProvider) {
		$stateProvider
			.state(componentName, {
				url: '/' + componentName,
				template: '<profile></profile>'
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

	function controller(usersDataService, provincesDataService, $state, $localStorage, $q) {
		var vm = this;

		vm.submit = function () {
			usersDataService.updatingUser(vm.user);
		}

		vm.deleteUser = function () {
			usersDataService.deletingUser(vm.user);
			delete $localStorage['xAccessToken'];
			$state.go('dashboard');
		}

		vm.init = function init() {
			var promiseUser = usersDataService.gettingUser();
			var promiseProvinces = provincesDataService.gettingAll();
			$q.all([promiseUser, promiseProvinces]).then(function(arrayData) {
				vm.user = arrayData[0];
				vm.provinces = arrayData[1];
			});
		}

		vm.init();

	}
})();
