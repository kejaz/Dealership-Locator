(function () {
    'use strict';

    var app = angular.module('app');

    // Collect the routes
    app.constant('routes', getRoutes());
    // Configure the routes and route resolvers
    app.config(['$httpProvider', '$provide', '$routeProvider', routeConfigurator]);
    function routeConfigurator($httpProvider, $provide, $routeProvider) {
        $provide.factory('$routeProvider', function () {
            return $routeProvider;
        });
    }
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    title: 'landing',
                    templateUrl: 'scripts/app/controllers/landing.html',
                    settings: {}
                }
            },
            {
                url: '/settings',
                config: {
                    title: 'settings',
                    templateUrl: 'scripts/app/controllers/settings.html',
                    settings: {}
                }
            }
        ];
    }
    app.run(function ($route, $routeProvider, routes) {

        routes.forEach(function (r) {
            setRoute(r.url, r.config);
        });

        $routeProvider.otherwise({ redirectTo: '/' });
        $route.reload();

        function setRoute(url, config) {
            config.resolve = angular.extend(config.resolve || {}, {
            });

            $routeProvider.when(url, config);
            if (config.editUrl) {
                $routeProvider.when(config.editUrl, config);
            }
        }
    });
})();