"use strict";
(function () {
    /** main container to hold the views for each state */
    var componentName = "mainsection";
    angular
        .module(componentName, ['ngAnimate'])
        .directive(componentName, directive)

    function directive() {
        return {
            template: '<main class="container mainsection" ui-view></main>'
        }
    }
})();
