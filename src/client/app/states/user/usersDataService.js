"use strict";
(function () {
    /** A service to handle user data operations  */
    var serviceName = "usersData";
    angular
        .module(serviceName, ['ngResource', 'ngStorage'])
        .service(serviceName + 'Service', usersDataService)

    /** declares resources and exposes methods to wor with them */
    function usersDataService($resource, $q, $localStorage, $rootScope) {

        var User = $resource(
            '/api/users/:id',
            {
                id: '@_id'
            },
            {
                'update':
                {
                    method: 'PUT'
                }
            });
        var Session = $resource('/api/users/sessions');

        /** creates a new user resource */
        this.newUser = function (email, password) {
            var user = new User();
            user.email = email;
            user.password = password;
            return user;
        }
        /** creates a new session resource */
        this.newSession = function (email, password) {
            var session = new Session();
            session.email = email;
            session.password = password;
            return session;
        }
        /** saves a new user posting it to the server, is a register operation */
        this.postingUser = function (user) {
            return user.$save()
                .then(function (response) {
                    return saveToken(response);
                }, function (reason) {
                    return $q.reject(reason);
                });
        }
        /** saves a new session posting it to the server, is a login operation*/
        this.postingSession = function (session) {
            return session.$save()
                .then(function (response) {
                    return saveToken(response);
                }, function (reason) {
                    return $q.reject(reason);
                });
        }
        /** asks to get the user object from the server */
        this.gettingUser = function () {
            return User.get().$promise;
        }
        /** ask to update the user object at the server */
        this.updatingUser = function (user) {
            user.$update();
        }
        /** ask delete the user object at the server */
        this.deletingUser = function (user) {
            user.$delete()
                .then(function (response) {
                    return deleteToken();
                }, function (reason) {
                    return $q.reject(reason);
                });
        }
        /** saves the response token for later use in requests */
        function saveToken(response) {
            $localStorage.xAccessToken = response.token;
            $rootScope.isLogged = true;
            return response;
        }
        /** saves the response token for later use in requests */
        function deleteToken(response) {
            delete $localStorage['xAccessToken'];
            $rootScope.isLogged = false;
            return response;
        }
    }


})();
