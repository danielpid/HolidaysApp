"use strict";
(function () {
	var stateName = 'transactionsDataService';
	angular
		.module(stateName, ['ngResource'])
		.service('transactionsDataService', service)

	function service($resource) {
		var Resource = $resource(
			'/api/transactions/:id', {
				id: '@_id'
			}, {
				'update': {
					method: 'PUT'
				}
			});

		this.new = function () {
			return new Resource();
		}

		this.saving = function (resource) {
			return resource.$save();
		}

		this.querying = function () {
			return Resource.query();
		}

		this.getting = function (id) {
			return Resource.get({
				id: id
			});
		}

		this.updating = function (resource) {
			return resource.$update();
		}

		this.deleting = function (resource) {
			return resource.$delete();
		}

	}
})();
