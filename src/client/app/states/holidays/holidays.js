"use strict";
(function () {

    var stateName = "holidays";

    angular
        .module(stateName, ['ui.router', 'ui.bootstrap', 'provincesDataService', 'angularMoment'])
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

    function controller(provincesDataService, usersDataService, $scope, $q) {
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

        vm.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 ) );
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
            // festivos domingos
            if (myMoment.month() === month) {
                if (vm.isDomingo(myMoment)) {
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
            } else {
                return '';
            }
        }

        /**
         * Inserta en al array dt una fecha del día 1 de cada uno de los 12 meses
         */
        vm.initCurrentYear = function() {
            vm.dt = [];
            for (var i = 1; i <= 12; i++) {
                vm.dt.push(new Date(i + "/1/" + settings.currentYear));
            }
        }

        /**
         * Guarda un rango de fechas como vacaciones
         */
        vm.saveHolidays = function() {
            if (vm.dateFrom) {
                var momentFrom = moment(vm.dateFrom);
                if (vm.dateTo) {
                    var dates = [];
                    var momentTo = moment(vm.dateTo);
                    for (; momentFrom.diff(momentTo, 'days') <= 0; momentFrom.add(1, 'd')) {
                        if (!vm.isFestivoMoment(momentFrom) && !vm.isDomingo(momentFrom)) {
                            dates.push(momentFrom.clone().toDate());
                        }
                    }
                    usersDataService.gettingUser().then(function(user) {
                        if (user.holidays) {
                            user.holidays.push(dates);
                        } else {
                            user.holidays = dates;
                        }
                        usersDataService.updatingUser(user);
                    });
                }
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

        function init() {
            var promiseProvince = provincesDataService.getting("5648cf12aa31c2cf04e8b29c");
            var promiseUser = usersDataService.gettingUser();
            $q.all([promiseProvince, promiseUser]).then(function(arrayData) {
                vm.province = arrayData[0];
                vm.user = arrayData[1];
                vm.initCurrentYear();
            });
        }

        init();
    }

})();