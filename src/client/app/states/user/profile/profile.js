"use strict";
(function () {
	/** component state to view and edit the current user profile */
	var componentName = "profile";
	angular
		.module(componentName, ['ui.router', 'formly', 'formlyBootstrap', 'ngStorage'])
		.config(stateConfig)
		.directive(componentName, directive)

	function stateConfig($stateProvider, formlyConfigProvider) {
		$stateProvider
			.state(componentName, {
				url: '/' + componentName,
				template: '<profile></profile>'
			});

		formlyConfigProvider.setType({
			name: 'custom',
			templateUrl: 'custom.html'
		})
	}

	function directive() {
		return {
			templateUrl: 'app/states/user/' + componentName + '/' + componentName + '.html',
			controller: controller,
			controllerAs: componentName,
			bindToController: true
		}
	}

	function controller(usersDataService, $state, $localStorage) {
		var vm = this;

		init();

		function init() {
			/** gets the current logged user */
			usersDataService.gettingUser()
				.then(function (user) {
					vm.user = user;
				})
		}

		vm.fields = [
			{
				key: 'email',
				type: 'input',
				templateOptions: {
					label: 'Email',
					placeholder: 'Email',
					required: true,
					type: 'text'
				}
            },
			{
				key: 'name',
				type: 'input',
				templateOptions: {
					label: 'Name',
					placeholder: 'Name',
					required: true,
					type: 'text'
				}
            },
			{
				key: 'location',
				type: 'custom',
				templateOptions: {
					label: 'Location',
					placeholder: 'Location',
					type: 'text'
				}
            },
			{
				key: 'phone',
				type: 'input',
				templateOptions: {
					label: 'Phone',
					placeholder: 'Phone',
					required: true,
					minlength: 9,
					type: 'tel'
				}
            },
			{
				key: 'url',
				type: 'input',
				templateOptions: {
					label: 'URL',
					placeholder: 'http://',
				},
				validators: {
					urlAddress: function (viewValue, modelValue) {
						var value = modelValue || viewValue;
						return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(value);
					}
				}
            }

        ];

		vm.submit = function () {
			usersDataService.updatingUser(vm.user);
		}

		vm.deleteUser = function () {
			usersDataService.deletingUser(vm.user);
			delete $localStorage['xAccessToken'];
			$state.go('dashboard');
		}
	}
})();
