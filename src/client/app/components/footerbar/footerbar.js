"use strict";
(function () {
    /** Footer bar */
    var componentName = "footerbar";
    angular
        .module(componentName, [])
        .directive(componentName, directive)

    function directive() {
        return {
            template: '<footer class="footerbar"><p>by Daniel Pinillos Díaz</p></footer>'
        }
    }

})();
