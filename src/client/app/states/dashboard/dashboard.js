"use strict";
(function () {
	/** component state to show a dasboard  */
	var stateName = "dashboard";
	angular
		.module(stateName, ['ui.router'])
		.config(stateConfig)
		.directive(stateName, directive)

	/** declares a state for this component, it will handle the router logic also */
	function stateConfig($stateProvider) {
		$stateProvider
			.state(stateName, {
				url: '/',
				template: '<dashboard></dashboard>' // the directive that wraps the view and logic
			});
		// there are no controllers linked to views anymore
		// the directive will hold the logic in private controllers if needed
	}


	function directive() {
		return {
			templateUrl: 'app/states/' + stateName + '/' + stateName + '.html',
			controller: controller,
			controllerAs: stateName,
			bindToController: true,
			scope: {}
		}
	}

	function controller() {
		var vm = this;
		vm.title = "My great dashboard";
	}
})();
