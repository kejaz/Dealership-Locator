(function () {
    'use strict';

    angular
        .module('app')
        .controller('settings', settings);

    settings.$inject = ['$location', '$rootScope', 'deviceService'];

    function settings($location, $rootScope, deviceService) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'settings';

        activate();

        function activate() {
            deviceService.defaultBackButtonHandler = onDeviceBackButton;
        }

        function onDeviceBackButton(args) {
            console.log($location.path());
            window.location ="#/";
            console.log($location.path());
        }
    }
})();
