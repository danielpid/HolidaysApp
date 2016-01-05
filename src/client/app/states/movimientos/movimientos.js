"use strict";
(function () {
	var stateName = "movimientos";
	angular
		.module(stateName, ['ui.router', 'formly', 'formlyBootstrap', 'ngResource'])
		.config(stateConfig)
		.directive(stateName, directive)
		.service(stateName + "DataService", service)

	function stateConfig($stateProvider) {
		$stateProvider
			.state(stateName, {
				url: '/' + stateName,
				template: '<movimientos></movimientos>'
			});
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

	function controller(movimientosDataService) {
		var vm = this;
		vm.title = "Mis movimientos";

		vm.fields = [
			{
				key: 'tipo',
				type: 'input',
				templateOptions: {
					label: 'Tipo',
					placeholder: 'Ingreso o gasto',
					required: true,
					type: 'text'
				}
            },
			{
				key: 'categoria',
				type: 'input',
				templateOptions: {
					label: 'Categoría',
					placeholder: 'Elige categoría',
					required: true,
					type: 'text'
				}
            }, {
				key: 'fecha',
				type: 'input',
				templateOptions: {
					label: 'Fecha',
					required: false,
					type: 'date'
				}
            }, {
				key: 'importe',
				type: 'input',
				templateOptions: {
					label: 'Importe',
					placeholder: 'en euros',
					required: true,
					type: 'number'
				}
            },
        ]

		vm.guardarMovimiento = function () {
			movimientosDataService
				.insertingMovimiento(vm.movimiento)
				.then(function () {
					init();
				});
		}

		function init() {
			vm.movimiento = movimientosDataService.newMovimiento();
			vm.movimiento.tipo = "Ingreso";
			vm.movimiento.fecha = new Date();
			vm.movimiento.importe = 0;
			vm.movimientos = movimientosDataService.gettingMovimientos();
		}

		init();
	}

	function service($resource) {
		var Movimiento = $resource(
			'/api/movimientos/:id', {
				id: '@_id'
			}, {
				'update': {
					method: 'PUT'
				}
			});

		this.newMovimiento = function () {
			return new Movimiento();
		}

		this.insertingMovimiento = function (movimiento) {
			return movimiento.$save();
		}

		this.gettingMovimientos = function () {
			return Movimiento.query();
		}
	}
})();
