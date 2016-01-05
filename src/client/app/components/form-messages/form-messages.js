"use strict";
(function () {
	/** shows validation messages for a field  */
	var componentName = 'form-messages';
	angular
		.module(componentName, ['ngMessages'])
		.directive('formMessages', directive)

	function directive() {
		return {
			templateUrl: 'app/components/' + componentName + '/' + componentName + '.html',
			scope: {
				field: "=" // the field being validated
			}
		};
	}

})();
