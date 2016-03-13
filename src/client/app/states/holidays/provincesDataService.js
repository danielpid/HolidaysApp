"use strict";
(function () {
    var serviceName = 'provincesDataService';
    angular
        .module(serviceName, ['ngResource'])
        .service(serviceName, service)

    function service($resource) {
        var Resource = $resource(
            '/api/provinces/:id'
        );

        this.getting = function(id) {
            return Resource.get({
                id : id
            }).$promise;
        }

        this.gettingAll = function() {
            return Resource.query().$promise;
        }
    }
})();