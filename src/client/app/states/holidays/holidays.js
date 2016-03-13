"use strict";
(function () {

    var stateName = "holidays";

    angular
        .module(stateName, ['ui.router', 'ui.bootstrap', 'provincesDataService', 'angularMoment', 'angularSpinner'])
        .config(stateConfig)
        .directive(stateName, directive);

    function stateConfig($stateProvider) {
        $stateProvider
            .state(stateName, {
                url: '/' + stateName,
                template: '<holidays></holidays>'
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

    function controller(provincesDataService, usersDataService, $scope, $q, usSpinnerService, $state) {
        var vm = this;
        // datepicker common
        vm.format = 'dd/MM/yyyy';
        vm.minDate = new Date(settings.currentYear, 0, 1);
        vm.maxDate = new Date(settings.currentYear, 11, 31);
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        vm.open = function($event, status) {
            status.opened = true;
        };

        vm.setDate = function(year, month, day) {
            vm.dt = new Date(year, month, day);
        };

        vm.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() == 6 ) );
        };

        /**
         * Devuelve el nombre de una clase css en función del día del año (si es festivo, si es vacaciones...)
         * @param date
         * @param mode
         * @param month
         * @returns {*}
         */
        vm.getDayClass = function(date, mode, month) {
            var myMoment = moment(date);
            if (myMoment.month() === month) {
                // festivos sabados y domingos
                if (vm.isDomingo(myMoment) || vm.isSabado(myMoment)) {
                    return 'festivo';
                }
                // festivos nacionales
                if (vm.isFestivoMoment(myMoment)) {
                    return 'festivo';
                }
                // vacaciones
                if (vm.isVacacacionesMoment(myMoment)) {
                    return 'vacaciones';
                }
            }
        }

        /**
         * Inserta en al array dt una fecha del día 1 de cada uno de los 12 meses
         */
        vm.initCurrentYear = function() {
            usSpinnerService.spin('spinner-1');
            vm.dt = [];
            for (var i = 1; i <= 12; i++) {
                vm.dt.push(new Date(i + "/1/" + settings.currentYear));
            }
            usSpinnerService.stop('spinner-1');
        }

        vm.calculateDates = function() {
            var dates = [];
            var momentFrom = moment(vm.dateFrom);
            if (vm.dateTo) {
                var momentTo = moment(vm.dateTo);
                for (; momentFrom.diff(momentTo, 'days') <= 0; momentFrom.add(1, 'd')) {
                    if (!vm.isFestivoMoment(momentFrom) && !vm.isDomingo(momentFrom) && !vm.isSabado(momentFrom)) {
                        dates.push(momentFrom.clone().toISOString());
                    }
                }
            } else {
                dates = [momentFrom.clone().toISOString()];
            }
            return dates;
        }

        /**
         * Guarda un rango de fechas como vacaciones
         */
        vm.saveHolidays = function() {
            if (vm.dateFrom) {
                usSpinnerService.spin('spinner-1');
                var dates = vm.calculateDates();
                usersDataService.gettingUser()
                    .then(function(user) {
                        if (user.holidays) {
                            user.holidays = _.union(user.holidays, dates);
                        } else {
                            user.holidays = dates;
                        }
                        usersDataService.updatingUser(user)
                            .then(function(user) {
                                $state.go($state.current, {}, {reload: true});
                            });
                    });
            }
        }

        vm.deleteHolidays = function() {
            if (vm.dateFrom) {
                usSpinnerService.spin('spinner-1');
                var dates = vm.calculateDates();
                usersDataService.gettingUser()
                    .then(function(user) {
                        if (_.intersection(user.holidays, dates).length > 0) {
                            user.holidays = _.difference(user.holidays, dates);
                            usersDataService.updatingUser(user)
                                .then(function(user) {
                                    $state.go($state.current, {}, {reload: true});
                                });
                        } else {
                            usSpinnerService.stop('spinner-1');
                        }
                    });
            }
        }

        /**
         * Devuelve true si el momento pasado por parámetro es un festivo
         * @param myMoment
         * @returns {boolean}
         */
        vm.isFestivoMoment = function(myMoment) {
            for (var i = 0; i < vm.province.holidays.length; i ++) {
                var aux = moment(vm.province.holidays[i]);
                aux.year(moment().year());
                if (myMoment.isSame(aux, 'day')) {
                    return true;
                }
            }
            return false;
        }

        /**
         * Devuelve true si el momento pasado por parámetro es domingo
         * @param myMoment
         * @returns {boolean}
         */
        vm.isDomingo = function(myMoment) {
            return myMoment.day() == 0;
        }

        /**
         * Devuelve true si el momento pasado por parámetro es sábado
         */
        vm.isSabado = function(myMoment) {
            return myMoment.day() == 6;
        },

        /**
         * Devuelve true si el momento pasado por parámetro es un día de vacaciones del usuario
         * @param myMoment
         */
        vm.isVacacacionesMoment = function(myMoment) {
            for (var i = 0; i < vm.user.holidays.length; i ++) {
                var aux = moment(vm.user.holidays[i]);
                aux.year(moment().year());
                if (myMoment.isSame(aux, 'day')) {
                    return true;
                }
            }
            return false;
        }

        vm.init = function init() {
            // date from
            vm.dateFrom = null;
            vm.status1 = {
                opened: false
            };
            // date to
            vm.dateTo = null;
            vm.status2 = {
                opened: false
            };
            var promiseProvince = provincesDataService.getting("5648cf12aa31c2cf04e8b29c");
            var promiseUser = usersDataService.gettingUser();
            $q.all([promiseProvince, promiseUser]).then(function(arrayData) {
                vm.province = arrayData[0];
                vm.user = arrayData[1];
                vm.initCurrentYear();
            });
        }

        vm.init();
    }

})();