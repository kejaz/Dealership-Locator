// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    var LocatorApp = angular.module("LocatorApp", []);

    LocatorApp.controller("LocatorController", function ($scope, $http, $controller) {
        $scope.Name = "Kashif Ejaz";
        $scope.Title = "Pak Suzuki Dealership Locator";
        $scope.ToContinue = true;
        $scope.RecordLimit = 5;
        $scope.LoadTime = Date();
        $scope.ZoomLevel = 15;
        $scope.MapCenter;
        $scope.DataList;        
        
        document.addEventListener('deviceready', onDeviceReady.bind(this), false);
      
        function onDeviceReady() {
            document.addEventListener('pause', onPause.bind(this), false);
            document.addEventListener('resume', onResume.bind(this), false);               
            $scope.GetCurrentLocation = GetCurrentLocation;
            $scope.GetData = GetData;
            GetCurrentLocation();            
            function GetCurrentLocation() {
                var i = 1;                     //  set your counter to 1
                function myLoop() {           //  create a loop function
                    setTimeout(function () {    //  call a 3s setTimeout when the loop is called
                        cordinates(i);
                        GetData();                        
                        $scope.$apply();
                        i++;                     //  increment the counter
                        if (i < 0) {            //  if the counter < 10, call the loop function
                            myLoop();             //  ..  again which will trigger another 
                        }                        //  ..  setTimeout()
                    }, 3000)
                }
                myLoop();                      //  start the loop
            }  
            function cordinates(i) {                
                $("#map").show();
                var success = function (position) {
                    var coords = position.coords;
                    //var coords = { latitude: 24.837495, longitude: 67.081433 };
                    var myLatLng = { lat: coords.latitude, lng: coords.longitude};
                    //var myLatLng = { lat: coords.latitude + (i / 1000), lng: coords.longitude + (i / 1000) };
                    //var otherLatLng = { lat: coords.latitude + (i / 900), lng: coords.longitude + (i / 900) };
                    if ($scope.MapCenter == null) {
                        $scope.MapCenter = myLatLng;
                    }
                    var map = new google.maps.Map(
                        document.getElementById("map"),
                        {                           
                            center: $scope.MapCenter,
                            zoom: $scope.ZoomLevel
                        }
                    );
                    map.addListener('zoom_changed', function () {
                        $scope.ZoomLevel = map.getZoom();
                        $sope.$apply();
                    });
                    //map.addListener('center_changed', function () {
                    //    $scope.MapCenter = map.getCenter();
                    //    $sope.$apply();
                    //});
                    var image = 'http://paksuzuki.com.pk/Automobile/images/LocationPerson_2.png';
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        icon: image,
                        title: 'Your Location'
                    });

                    //var image = 'http://paksuzuki.com.pk/Automobile/images/b_suzuki.gif';
                    //var marker = new google.maps.Marker({
                    //    position: otherLatLng,
                    //    map: map,
                    //    icon: image,
                    //    title: 'Your Location'
                    //});


                    google.maps.event.addListener(marker, "click", function (e) {
                        var infoWindow = new google.maps.InfoWindow();
                        infoWindow.setContent(marker.title);
                        infoWindow.open(map, marker);
                    });                  

                }
                var error = function (error) {
                    navigator.notification.alert("Error location your location: " + error.messgae, "INFORMATION");
                }

                var opeco = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
                navigator.geolocation.getCurrentPosition(success, error, opeco);
            }
            /////////////// Get Data from serevr
            function GetData() {
                var urlApp = 'http://192.168.1.202:9999/Automobile/Pages/locator.aspx';
                $http({
                    method: 'GET',
                    url: urlApp

                }).
                  success(function (data) {
                      $scope.DataList = data;
                      $scope.LoadTime = $scope.DataList[0].DeviceID + Date();

                       }).error(function (data, status, headers, config) {
                           alert("failure");
                       });               
            }


        };      
        function onPause() {         
        };

        function onResume() {            
        };
    })
})();