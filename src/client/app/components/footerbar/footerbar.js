"use strict";
(function () {
    /** Footer bar */
    var componentName = "footerbar";
    angular
        .module(componentName, [])
        .directive(componentName, directive)

    function directive() {
        return {
            template: '<footer class="footerbar"><p>by <a href="http://agorabinaria.com/">Ágora Binaria</a> for <a href="http://academia-binaria.com/">Academia Binaria</a>.</p></footer>'
        }
    }

})();
