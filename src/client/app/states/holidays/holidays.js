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

    function controller(provincesDataService, usersDataService, $scope) {
        var vm = this;
        // datepicker common
        vm.format = 'dd/MM/yyyy';
        vm.minDate = new Date(2015, 0, 1);
        vm.maxDate = new Date(2015, 11, 31);
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


        vm.getDayClass = function(date, mode, month) {
            var myMoment = moment(date);
            // festivos domingos
            if (vm.isDomingo(myMoment) && myMoment.month() === month) {
                return 'festivo';
            }
            // festivos nacionales
            if (vm.isFestivoMoment(myMoment) && myMoment.month() == month) {
                return 'festivo';
            }
            //for (var i = 0; i < vm.province.holidays.length; i ++) {
            //    var aux = new Date(vm.province.holidays[i]);
            //    if (aux.getDate() == date.getDate() && aux.getMonth() == date.getMonth() && date.getMonth() === month) {
            //        return 'festivo';
            //    }
            //}
            return '';
        }

        vm.initCurrentYear = function() {
            vm.dt = [];
            for (var i = 1; i <= 12; i++) {
                vm.dt.push(new Date(i + "/1/2015"));
            }
        }

        vm.saveHolidays = function() {
            if (vm.dateFrom) {
                var momentFrom = moment(vm.dateFrom);
                if (vm.dateTo) {
                    var dates = [];
                    var momentTo = moment(vm.dateTo);
                    for (; momentFrom.diff(momentTo, 'days') != 0; momentFrom.add(1, 'd')) {
                        if (!vm.isFestivoMoment(momentFrom) && !vm.isDomingo(momentFrom)) {
                            dates.push(momentFrom.clone().toDate());
                        }
                    }
                    usersDataService.saveHolidays(dates);
                }
            }
        }

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

        vm.isDomingo = function(myMoment) {
            return myMoment.day() == 0;
        }

        function init() {
            var promise = provincesDataService.getting("5648cf12aa31c2cf04e8b29c");
            promise.$promise.then(function(data) {
                vm.province = data;
                vm.initCurrentYear();
            });
        }

        init();
    }

})();