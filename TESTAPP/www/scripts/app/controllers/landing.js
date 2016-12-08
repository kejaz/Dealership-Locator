(function () {
    'use strict';

    angular
        .module('app')
        .controller('landing', landing);

    landing.$inject = ['$location', '$rootScope', 'deviceService'];

    function landing($location, $rootScope, deviceService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'landing';

        activate();

        function activate() {
            deviceService.defaultBackButtonHandler = undefined;
        }
    }
})();
