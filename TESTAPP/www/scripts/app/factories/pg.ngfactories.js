(function () {
    'use strict';

    var app = angular.module('app');
    /**
     * Device service factory
     */
    app.factory('deviceService', deviceService);
    deviceService.$inject = ['$http', '$location', '$rootScope'];
    function deviceService($http, $location, $rootScope) {

        var service = {
            onDeviceBackButton: function (args) { $rootScope.$broadcast('onDeviceBackButton', args); },
            defaultBackButtonHandler: undefined
        };
        Object.defineProperty(service, "isWindowsUniversal", {
            get: function () {
                return window.WinJS && window.WinJS.Application;
            }
        });
        // Hook backbutton
        if (service.isWindowsUniversal)
            window.WinJS.Application.addEventListener('backclick', backbuttonCallback, false);
        else
            document.addEventListener('backbutton', backbuttonCallback, false);
        
        $rootScope.deviceService = service;
        return service;

        function backbuttonCallback(e) {
            if (!service.defaultBackButtonHandler || !service.defaultBackButtonHandler()) {
                if (e.preventDefault)
                    e.preventDefault();
                service.onDeviceBackButton();
                return true;
            }
            return false;
        }

    }
})();