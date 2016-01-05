"use strict";
(function () {
    /** configures the current module with http interceptors to implement client side security logic*/
    angular
        .module("security",['ui.router','ngStorage'])
        .config(interceptorsConfiguration);

    /** interceptors configuration function */
    function interceptorsConfiguration($httpProvider) {
        $httpProvider.interceptors.push(securityInterceptor);
    }

    /** factory function for security interceptions */
    function securityInterceptor($injector, $q, $localStorage) {
        /** object with enet handlers to perform security logic */
        return {
            request: requestInterceptor,
            responseError: responseErrorInterceptor
        };
        function requestInterceptor(request) {
            /** on each request send the current xAccessToken in a header */
            request.headers['x-access-token'] = $localStorage.xAccessToken;
            return request;
        };
        function responseErrorInterceptor(response) {
            /** on each response chek for security error codes */
            if (response.status === 401) {
                /** if no authentication send user to login state */
                $injector.get('$state').go('login');
            }
            return $q.reject(response);
        };
    }

} ());
