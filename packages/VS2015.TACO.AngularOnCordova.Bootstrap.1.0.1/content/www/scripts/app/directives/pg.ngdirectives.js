(function () {

    'use strict';

    var app = angular.module('app');
    /**
     * Toolbar directive
     */
    app.directive('toolbar', toolbar);
    toolbar.$inject = ['$window'];
    function toolbar($window) {
        // Usage:
        //     <toolbar></toolbar>
        // Creates:
        // 
        var directive = {
            link: link,
            replace: true,
            restrict: 'E',
            transclude: true,
            templateUrl: 'scripts/app/directives/toolbar.html',
        };
        var snapper = undefined;
        return directive;
        function compile(element, attrs) {
        };
        function link(scope, element, attrs) {
            snapper = new Snap({
                element: document.getElementById('content'),
                dragger: document.getElementById('toolbar'),
                disable: 'right',
            });
            $('#toolbar').click(function () { toggle(); });
            scope.$on('toggle-sidebar', function (evt, args) { toggle(); })
        };
        function toggle() {
            if (snapper.state().state == "left") {
                snapper.close();
            } else {
                snapper.open('left');
            }
        }
    }
    /**
     * Sidebar directive
     */
    app.directive('sidebar', sidebar);
    sidebar.$inject = ['$window'];
    function sidebar($window) {
        // Usage:
        //     <sidebar></sidebar>
        // Creates:
        // 
        var directive = {
            link: link,
            replace: true,
            restrict: 'E',
            transclude: true,
            templateUrl: 'scripts/app/directives/sidebar.html',
        };
        return directive;
        function compile(element, attrs) {
        };
        function link(scope, element, attrs) {
            $('.nav a').click(function () {
                scope.$broadcast('toggle-sidebar', {});
            });
        };
    }

})();