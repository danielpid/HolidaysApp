"use strict";
(function () {
	/** Navigation bar, and logic to control user state */
	var componentName = "navbar";
	angular
		.module(componentName, ['ui.router','navbarCtrl'])
		.directive(componentName, directive)

	function directive() {
		return {
			templateUrl: 'app/components/' + componentName + '/' + componentName + '.html',
			controller: "navbarCtrl",
			controllerAs: componentName,
			bindToController: true
		}
	}
})();

(function () {
	angular
		.module('navbarCtrl',['ui.router', 'ngStorage'])
        .controller("navbarCtrl", controller);
    function controller($state, $localStorage, $rootScope) {
		var vm = this;

		vm.isActive = function (state) {
			return $state.is(state);
		}
		vm.logout = function () {
			delete $localStorage['xAccessToken'];
			$rootScope.isLogged = false;
			$state.go('logout');
		}

		init();

		function init() {
			$rootScope.isLogged = $localStorage['xAccessToken'] != null;
		}
	}
})();

