// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    
    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    // This is a function that bootstraps AngularJS, which is called from later code
    function bootstrapApplication() {
        
        console.log("Bootstrapping AngularJS");
        // This assumes your app is named "app" and is on the body tag: <body ng-app="app">
        // Change the selector from "body" to whatever you need
        var domElement = document.getElementById('pg-ngapp')
        // Change the application name from "app" if needed
        angular.bootstrap(domElement, ['app']);
    }
    /**
     * Hook device events 
     */
    function bootstrapDevice() {
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
    }

    // This is my preferred Cordova detection method, as it doesn't require updating.
    if (document.URL.indexOf('http://') === -1
            && document.URL.indexOf('https://') === -1) {
        console.log("URL: Running in Cordova/PhoneGap");
        // bootstrap device
        bootstrapDevice();
        document.addEventListener("deviceready", bootstrapApplication, false);
    } else {
        console.log("URL: Running in browser");
        bootstrapApplication();
    }
})();

