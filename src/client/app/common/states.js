"use strict";
(function () {
    /** configures the current module with state and route logic*/
    angular
        .module('url',[])
        .config(statesConfig)

    function statesConfig($urlRouterProvider, $locationProvider) {
        /** used to avoid 404 urls , to be enhanced...  */
        $urlRouterProvider.otherwise('/')
        /** use only if you need pretty (without hash #) url*/
        /*
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
        */
    }

})()
