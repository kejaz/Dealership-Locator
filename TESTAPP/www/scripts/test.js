// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    var TestApp = angular.module("TestApp", []);
    TestApp.controller("TestController", function ($scope, $http, $controller) {
        document.addEventListener('deviceready', onDeviceReady.bind(this), false);

        function onDeviceReady() {
            document.addEventListener('pause', onPause.bind(this), false);
            document.addEventListener('resume', onResume.bind(this), false);
            $scope.CenterChanged = CenterChanged;
            $scope.MapCenter;
            $scope.LoadTime = Date();
            $scope.cordinates = cordinates;
            $scope.GetCurrentLocation = GetCurrentLocation;            
            GetCurrentLocation();
            var gmarkers = [];
            function GetCurrentLocation() {
                var i = 1;                     //  set your counter to 1
                function myLoop() {           //  create a loop function
                    setTimeout(function () {    //  call a 3s setTimeout when the loop is called
                        cordinates(i);
                        $scope.$apply();
                        i++;                     //  increment the counter
                        if (i < 999999999) {            //  if the counter < 10, call the loop function
                            myLoop();             //  ..  again which will trigger another 
                        }                        //  ..  setTimeout()
                    }, 7000)
                }
                myLoop();                      //  start the loop
            }
            $("#map").show();

            var map = new google.maps.Map(
                       document.getElementById("map"),
                       {
                           center: $scope.MapCenter,
                           zoom: 14
                       }
                );           

            function CenterChanged() {
                var coords = { latitude: 23.837495, longitude: 62.081433 };
                var myLatLng = { lat: coords.latitude, lng: coords.longitude };
                map.setCenter(myLatLng);
            }
            function cordinates(i) {
                var success = function (position) {
                    var coords = position.coords;
                    $scope.LoadTime = Date();
                    $scope.$apply();
                    //var coords = { latitude: 24.837495, longitude: 67.081433 };
                    var myLatLng = { lat: coords.latitude, lng: coords.longitude };
                    //var myLatLng = { lat: coords.latitude + (i / 1000), lng: coords.longitude + (i / 1000) };
                    //setMapOnAll(null);
                    //markers = [];
                    var image = 'http://paksuzuki.com.pk/Automobile/images/Visit-48.png';
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        icon: image,
                        title: 'Your Location'
                    });
                    gmarkers.push(marker);
                    if (i == 1) {
                        $scope.MapCenter = myLatLng;
                        map.setCenter(myLatLng);
                        $scope.$apply();
                    }
                    else {
                        gmarkers[0].setMap(null);
                        gmarkers.splice(0, 1);
                    }
                    //GetData(coords.latitude, coords.longitude);
                }
                var error = function (error) {
                    navigator.notification.alert("Error location your location: " + error.messgae, "INFORMATION");
                }

                var opeco = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
                navigator.geolocation.getCurrentPosition(success, error, opeco);
            }          
            function GetData(lat, lng) {
                var deviceID = device.uuid;
                var manu = device.manufacturer;                
                var urlApp = "http://paksuzuki.com.pk/Automobile/Pages/locator.aspx?uid=" + deviceID + "&manu=" + manu + "&lat=" + lat + "&lng=" + lng;
                $http({
                    method: 'GET',
                    url: urlApp

                }).
                  success(function (data) {
                      $scope.DataList = data;
                      $.each($scope.DataList, function (index, value) {
                          if ($scope.DataList[index].DeviceID != deviceID) {
                              var UserLatLng = { lat: parseFloat($scope.DataList[index].Lat), lng: parseFloat($scope.DataList[index].Lng) };
                              var Userimage = 'http://paksuzuki.com.pk/Automobile/images/Visit-49.png';
                              var Usermarker = new google.maps.Marker({
                                  position: UserLatLng,
                                  map: map,
                                  icon: Userimage,
                                  title: $scope.DataList[index].UserName + ' ('+  $scope.DataList[index].DeviceID + ')'
                              });
                          }
                      });

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