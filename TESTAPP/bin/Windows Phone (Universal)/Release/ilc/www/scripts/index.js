// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    var helloApp = angular.module("helloApp", []);
    helloApp.directive("repeatEnd", function () {
        return {
            restrict: "A",
            link: function (scope, element, attrs) {
                $('.footable').trigger('footable_initialized');
                $('.footable').trigger('footable_resize');
                $('.footable').data('footable').redraw();
                if (scope.$last) {
                    scope.$eval(attrs.repeatEnd);
                }
            }
        };
    });
    helloApp.directive('customPager', function () {
        return {
            scope: {
                page: '@',
                pagesCount: '@',
                totalCount: '@',
                searchFunc: '&',
                customPath: '@'
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'pager.html',
            controller: ['$scope', function ($scope) {
                $scope.search = function (i) {
                    if ($scope.searchFunc) {
                        $scope.searchFunc({ page: i });
                    }
                };

                $scope.range = function () {
                    if (!$scope.pagesCount) { return []; }
                    var step = 2;
                    var doubleStep = step * 2;
                    var start = Math.max(0, $scope.page - step);
                    var end = start + 1 + doubleStep;
                    if (end > $scope.pagesCount) { end = $scope.pagesCount; }

                    var ret = [];
                    for (var i = start; i != end; ++i) {
                        ret.push(i);
                    }

                    return ret;
                };

                $scope.pagePlus = function (count) {
                    return +$scope.page + count;
                }
            }]
        }
    });

    helloApp.controller("HttpController", function ($scope, $http, $controller) {
        $scope.Name = "Kashif Ejaz";
        $scope.Title = "Pak Suzuki Dealership Locator";
        $scope.ToContinue = true;
        $scope.RecordLimit = 5;
        $scope.LoadHome = LoadHome;
        function LoadHome() {           
            $scope.Title = "Pak Suzuki Dealership Locator";
            $("#map").hide();
            $("#lblDis").hide();
            $("#dealersList").hide();            
            $('#mainPage').show();
            $('#loadingDealers').hide();          
        }
        //$('.footable').footable();

        document.addEventListener('deviceready', onDeviceReady.bind(this), false);        
        function onDeviceReady() {
            // Handle the Cordova pause and resume events
            document.addEventListener( 'pause', onPause.bind( this ),    false );
            document.addEventListener('resume', onResume.bind(this), false);
            
            // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.        
            //var changeColorButton = document.querySelector("#changeColor");
            //changeColorButton.addEventListener("click", setRandomColor, false);
            //document.getElementById("btnTakePhoto").onclick = function () {
            //    alert("Looking Good!");
            //    navigator.camera.getPicture(function (imageUri) {
            //        var lastPhotoConainer = document.getElementById("lastPhoto");
            //        lastPhotoConainer.innerHTML = "<img src = '" + imageUri + "' style='width: 75%;'/>";
            //    }, null, null);
            //};
            //$('#btnLocator').hide();
            //$('#btnPSMCLLocator').hide();
            //$('#btnDistance').hide();
            LoadHome();
            $scope.GetCurrentLocation = GetCurrentLocation;
            $scope.GetNearByDealerships = GetNearByDealerships;
            $scope.BackToList = BackToList;
            $scope.EnableList = EnableList;
            $scope.Path = '';
            $scope.TitleDealersList = '';
            $scope.DealersListSorted;
            $scope.filterdealers;
            $scope.clearSearch = clearSearch;
            $scope.SetView = SetView;
            $scope.search = search;
            $scope.page = 0;
            $scope.pagesCount = 0;
            $scope.pageSize = 10;
            
            $scope.TextChange = function () {
                $scope.ResetGrid();
            };            

            $scope.ResetGrid = function () {
                $('.footable').trigger('footable_initialized');
                $('.footable').trigger('footable_resize');
                $('.footable').data('footable').redraw();

                //$('.footable').trigger('footable_redraw');
                //$('.footable').trigger('footable_resize');
                //$('.footable').trigger('footable_redraw');
            }
            $('#TileView').hide();
            function clearSearch() {
                $scope.filterdealers = '';
            }
            function EnableList() {
                $scope.ResetGrid();
                //$('#loadingDealers').hide();
               // $("#dealersList").show();
            }
            function search(page) {
                $('#loadingDealers').show();
                $("#dealersList").hide();
                page = page || 0;
                $scope.page = page;
                $scope.pagesCount = parseInt(Math.ceil($scope.DealersList.length / $scope.pageSize));
                $scope.totalCount = $scope.DealersList.length;
                var indexStart = page * $scope.pageSize;                
                $scope.DealersListSorted = $scope.DealersList.slice(indexStart, indexStart + $scope.pageSize);
                $('#loadingDealers').hide();
                $("#dealersList").show();
                $scope.ResetGrid();

            }
            function SetView(pView)
            {
                $('#TileView').hide();
                $('#ListView').hide();

                if (pView == 'Tile') {
                    $('#TileView').show();
                }
                else {
                    $('#ListView').show();                    
                }                
            }
            //document.getElementById("btnPSMCLLocator").addEventListener("click", cordinatesPSMCL);
            //document.getElementById("btnLocator").addEventListener("click", cordinates);
            //document.getElementById("btnDistance").addEventListener("click", distance);
            //document.getElementById("btnNearestDealership").addEventListener("click", GetDealers);           
            function BackToList() {
                $("#map").hide();
                $("#lblDis").hide();
                $("#dealersList").show();
            }          
            $(function () {
                $('.footable').footable();
            });
            function GetNearByDealerships(recordLimit) {                
                $('#mainPage').hide();
                $scope.RecordLimit = recordLimit;
                $scope.Title = "Nearby Dealerships";
                if (recordLimit != 0) {
                    $scope.Title = 'Top (' + "" + recordLimit + ") Nearby Dealerships";
                }
                else {
                    $scope.Title = "All Nearby Dealerships";
                }
                GetDealers();
            }
            function CollapsMenu() {
                $(function () {
                    $('#mnu1,#submenu1,#submenu2,#submenu3,#submenu4').on('click', function () {
                        if ($('.navbar-header .navbar-toggle').css('display') != 'none') {
                            $(".navbar-header .navbar-toggle").trigger("click");
                        }
                    });
                });
            }
            function GetCurrentLocation() {
                CollapsMenu();
                $('#mainPage').hide();
                $scope.Title = "My Current Location";
                cordinates();
            }           
            $scope.GetDealersPath = GetDealersPath;
            function GetDealersPath(dealerLat, dealerLng, dealershipName)
            {
                $scope.Path = "Your Location to " + dealershipName;
                var success = function (position) {
                        $("#map").show();                     
                        $("#lblDis").show();
                        $("#dealersList").hide();
                        var coords = position.coords;
                        //var coords = { latitude: 24.837495, longitude: 67.081433 };
                        var targetLatLng = { latitude: dealerLat, longitude: dealerLng };                        
                        DrawMap(coords, targetLatLng, dealershipName);
                    }
                    var error = function (error) {
                        navigator.notification.alert("Error location your location: " + error.messgae, "INFORMATION");
                    }
                    var opeco = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
                    navigator.geolocation.getCurrentPosition(success, error, opeco);               
            }

            //function GetDealers() {
            //    $('#loadingDealers').show();
            //    $("#dealersList").hide();
            //    $("#map").hide();
            //    $("#lblDis").hide();

            //    var success = function (position) {
            //        //var coords = position.coords;
            //        var coords = { latitude: 24.837495, longitude: 67.081433 };                    
            //        var urlApp = 'http://www.suzukifamily.com.pk/dealerservicetest?coords=' + coords.latitude + ',' + coords.longitude + '&recordLimit=' + $scope.RecordLimit;
            //        $http({
            //            method: 'GET',                        
            //            url: urlApp

            //        }).
            //            success(function (data) {
            //                $scope.DealersListSorted = data;                            
            //                $('#loadingDealers').hide();
            //                $("#dealersList").show();
            //                $scope.ResetGrid();

            //            }).error(function (data, status, headers, config) {
            //                alert("failure");
            //            });                                       
            //    }
            //    var error = function (error) {
            //        navigator.notification.alert("Error location your location: " + error.messgae, "INFORMATION");
            //    }
            //    var opeco = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
            //    navigator.geolocation.getCurrentPosition(success, error, opeco);
            //}
            //function GetDealers() {
            //    $('#loadingDealers').show();
            //    $("#dealersList").hide();
            //    $("#map").hide();
            //    $("#lblDis").hide();
            //    var urlApp = 'http://www.suzukifamily.com.pk/DealershipLocatiorService';
            //    $http({
            //        method: 'GET',
            //        url: urlApp

            //    }).
            //      success(function (data) {
            //               $scope.DealersList = data;
            //               var success = function (position) {
            //                   //var coords = position.coords;
            //                   var coords = { latitude: 24.837495, longitude: 67.081433 };
            //                   var coordsDealer = { latitude: $scope.DealersList[0].DealershipLatitude, longitude: $scope.DealersList[0].DealershipLongitude};
            //                   GetDistance($scope.DealersList, 0, coords, coordsDealer);                            
            //               }
            //               var error = function (error) {
            //                   navigator.notification.alert("Error location your location: " + error.messgae, "INFORMATION");
            //               }
            //               var opeco = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
            //               navigator.geolocation.getCurrentPosition(success, error, opeco);

            //           }).error(function (data, status, headers, config) {
            //               alert("failure");
            //           });               
            //}
            function GetDealers() {
                $('#loadingDealers').show();
                $("#dealersList").hide();
                $("#map").hide();
                $("#lblDis").hide();                
                $scope.DealersList = jQuery.parseJSON('[{ "DealershipName": "Khair Agencies", "DealershipAddress": "Al-Hamad Appartment, Main Qasimabad Road, Hyderabad.", "DealershipContact": "(022) 111-111-772", "DealershipLatitude": 25.3928750, "DealershipLongitude": 68.3363450, "MapZoomLevel": 10, "DealershipCity": "Hyderabad" }, { "DealershipName": "Suzuki Carachi Motors", "DealershipAddress": "1, Banglore Town, Main Shahrah-e-Faisal, Karachi.", "DealershipContact": "(021) 34547145, 34545376, 34385042", "DealershipLatitude": 24.8684300, "DealershipLongitude": 67.0874120, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Polad & Co.", "DealershipAddress": "Polad Building, M.A. Jinnah Road, Opp. Gul Plaza, Karachi.", "DealershipContact": "(021) 32720532, 32720574 (021) 111-111-497", "DealershipLatitude": 24.8634460, "DealershipLongitude": 67.0228350, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Suzuki Macca Motors", "DealershipAddress": "FL, 08-09, Main Rashid Minhas Road, Karachi.", "DealershipContact": "(021) 34588991-5", "DealershipLatitude": 24.8966940, "DealershipLongitude": 67.1187190, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Suzuki Defence Motors", "DealershipAddress": "Plot No. 145, Phase-I, Defence Housing Authority, Main Korangi Road, Karachi.", "DealershipContact": "(021) 35892430-1", "DealershipLatitude": 24.8365960, "DealershipLongitude": 67.0708140, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "SNA Motors", "DealershipAddress": "Plot No. SB-9, Sector No. 27, Korangi Industrial Area, Karachi.", "DealershipContact": "(021) 35077161-65, 35067132", "DealershipLatitude": 24.8437610, "DealershipLongitude": 67.1469350, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Suzuki South", "DealershipAddress": "Plot No. 25/1, Sector No. 23, Korangi Industrial Area, Karachi.", "DealershipContact": "(021) 111-776-884, (021) 35115454-60", "DealershipLatitude": 24.8358950, "DealershipLongitude": 67.1100280, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Margalla Motors", "DealershipAddress": "166-A, Sir Syed Road Opp. Khalid Bin Waleed Road, Block-III, P.E.C.H.S., Karachi.", "DealershipContact": "(021) 34531374-5, (021) 111-007-786", "DealershipLatitude": 24.8774870, "DealershipLongitude": 67.0583530, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Danish Motors", "DealershipAddress": "167-F, BlockIII, Khalid Bin Waleed Road, P.E.C.H.S., Karachi.", "DealershipContact": "(021) 34557151-2, 34558458-9", "DealershipLatitude": 24.8786890, "DealershipLongitude": 67.0600800, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Suzuki Western Motors", "DealershipAddress": "F-44, Estate Avenue S.I.T.E, Karachi.", "DealershipContact": "(021) 32571786, 32582981-82", "DealershipLatitude": 24.8905630, "DealershipLongitude": 66.9867110, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Mandviwalla Motors(Pvt) Ltd", "DealershipAddress": "Mandviwalla Chambers, Old Queens Road, Off M.T. Khan Road, Karachi.", "DealershipContact": "(021) 111-111-135", "DealershipLatitude": 24.8459420, "DealershipLongitude": 67.0031690, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Suzuki Motorways", "DealershipAddress": "Near Cantonment Board Faisal, Main Shahrah-e-Faisal, Karachi.", "DealershipContact": "(021) 34573361-2, 34576624-5", "DealershipLatitude": 24.8820080, "DealershipLongitude": 67.1125710, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Nadeem International", "DealershipAddress": "Plot No. 164, Jogi Mor Main National Highway Karachi.", "DealershipContact": "(021) 35001524-31", "DealershipLatitude": 24.8555220, "DealershipLongitude": 67.2448900, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Naseer Autos", "DealershipAddress": "D-55-A/1, Estate Avenue, S.I.T.E, Karachi.", "DealershipContact": "(021) 32573266-69, 32567160-1", "DealershipLatitude": 24.8955260, "DealershipLongitude": 66.9937490, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Plaza Motors", "DealershipAddress": "331 AM, Preedy Street, Opp. Preedy Police Station, Saddar, Karachi.", "DealershipContact": "(021) 32722925, 32720771", "DealershipLatitude": 24.8613680, "DealershipLongitude": 67.0224110, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Khalil Motors", "DealershipAddress": "D-3, Al-Hilal Co-Operative H.S. Opp. Askari Park, Main University Road, Karachi.", "DealershipContact": "(021) 34923526, 34944113-4", "DealershipLatitude": 24.8933460, "DealershipLongitude": 67.0648810, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Suzuki Tharparkar Motors", "DealershipAddress": "Main Hyderabad Road, Mirpurkhas.", "DealershipContact": "0233 - 862223 – 25", "DealershipLatitude": 25.5169990, "DealershipLongitude": 68.9631990, "MapZoomLevel": 10, "DealershipCity": "Mirpurkhas" }, { "DealershipName": "Bahawalpur Motors", "DealershipAddress": "Shafiq Plaza, Multan Road, Bahawalpur.", "DealershipContact": "(062) 2880230, 2888222", "DealershipLatitude": 29.3652710, "DealershipLongitude": 71.6320610, "MapZoomLevel": 10, "DealershipCity": "Bahawalpur" }, { "DealershipName": "United Motors", "DealershipAddress": "Hasilpur Road, Vehari.", "DealershipContact": "(067) 3362262-3", "DealershipLatitude": 30.0443000, "DealershipLongitude": 72.3669860, "MapZoomLevel": 10, "DealershipCity": "Vehari" }, { "DealershipName": "Suzuki Pioneer Motors", "DealershipAddress": "Rajapur, 10 Km, Khanewal Road, Multan.", "DealershipContact": "(061) 6783521-25", "DealershipLatitude": 30.2212870, "DealershipLongitude": 71.5403080, "MapZoomLevel": 10, "DealershipCity": "Multan" }, { "DealershipName": "Suzuki Multan Motors", "DealershipAddress": "348, Khanewal Road, Multan.", "DealershipContact": "(061) 6780881-3", "DealershipLatitude": 30.2076960, "DealershipLongitude": 71.5015130, "MapZoomLevel": 10, "DealershipCity": "Multan" }, { "DealershipName": "Suzuki Fort Motors", "DealershipAddress": "Plot No. 11, Industrial Estate Phase-II, Multan.", "DealershipContact": "(061) 6538003-4", "DealershipLatitude": 30.1349210, "DealershipLongitude": 71.3683460, "MapZoomLevel": 10, "DealershipCity": "Multan" }, { "DealershipName": "Suzuki Oriental Motors", "DealershipAddress": "Lahore-Multan Road, Near Pakpattan Chowk, Sahiwal.", "DealershipContact": "(040) 4463555, 4463686", "DealershipLatitude": 30.6279970, "DealershipLongitude": 73.1177470, "MapZoomLevel": 10, "DealershipCity": "Sahiwal" }, { "DealershipName": "Suzuki Kasur Motors", "DealershipAddress": "6 Km, Main Ferozepur Road, Kasur.", "DealershipContact": "(049) 2716161-2, 2716277", "DealershipLatitude": 31.1538740, "DealershipLongitude": 74.4600320, "MapZoomLevel": 10, "DealershipCity": "Kasur" }, { "DealershipName": "Lyallpur Motors", "DealershipAddress": "East Canal Road, Faisalabad.", "DealershipContact": "(041) 111-000-909, 8726863, 8531783", "DealershipLatitude": 31.4378170, "DealershipLongitude": 73.1383900, "MapZoomLevel": 10, "DealershipCity": "Faisalabad" }, { "DealershipName": "Suzuki Mehran Motors", "DealershipAddress": "Main Jamshoro Road, Hyderabad.", "DealershipContact": "(022) 3668001-4, 3668006-7, 3668008", "DealershipLatitude": 25.4241870, "DealershipLongitude": 68.3419020, "MapZoomLevel": 10, "DealershipCity": "Hyderabad" }, { "DealershipName": "Zeeshan Autos", "DealershipAddress": "Shop No. 22, 23, 24 Cantt. Shopping Centre. Autobhan Road, Latifabad Unit No.7, Hyderabad.", "DealershipContact": "(022) 3816535, 3816612", "DealershipLatitude": 25.3749720, "DealershipLongitude": 68.3554210, "MapZoomLevel": 10, "DealershipCity": "Hyderabad" }, { "DealershipName": "Suzuki Faisalabad Motors", "DealershipAddress": "9-10, Muslim Town No. 3, Sargodha Road, Faisalabad.", "DealershipContact": "(041) 111-222-700", "DealershipLatitude": 31.4652940, "DealershipLongitude": 73.0853030, "MapZoomLevel": 10, "DealershipCity": "Faisalabad" }, { "DealershipName": "Sethi Motors", "DealershipAddress": "Shahrah-e-Fatima Jinnah, Lahore.", "DealershipContact": "(042) 36371564-65, 36303850, 36304088.", "DealershipLatitude": 31.4998060, "DealershipLongitude": 74.3350410, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Adil Zaffar Motors", "DealershipAddress": "10 Km, Main Multan Road, Hanjarawal Opp. Canal View Housing Society, Lahore.", "DealershipContact": "(042) 35421544, 35430336", "DealershipLatitude": 31.4848930, "DealershipLongitude": 74.2540600, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Ali Jan Motors", "DealershipAddress": "21, Shahrah-e-Fatima Jinnah, Lahore.", "DealershipContact": "(042) 36304273, 36312832", "DealershipLatitude": 31.5520440, "DealershipLongitude": 74.3203750, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Ali Motors", "DealershipAddress": "26/1, Jail Road, Lahore.", "DealershipContact": "042-37423988-9, 042-37423990-1", "DealershipLatitude": 31.5459730, "DealershipLongitude": 74.3190550, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Khalid Motors", "DealershipAddress": "65, Link Ferozepur Road, Lahore.", "DealershipContact": "(042) 37591572-3", "DealershipLatitude": 31.5432300, "DealershipLongitude": 74.3159010, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Madni Motors", "DealershipAddress": "16-B, Jail Road, Lahore.", "DealershipContact": "(042) 37425100, 37425200, 37425300", "DealershipLatitude": 31.5194710, "DealershipLongitude": 74.3566490, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Master Motors", "DealershipAddress": "Street No. 12, Iqbal Park, Near Main Gate Defence Society, Lahore Cantt.", "DealershipContact": "(042) 36304293, 36603481-83", "DealershipLatitude": 31.4830820, "DealershipLongitude": 74.3838360, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Olympia Motors", "DealershipAddress": "37-A, Jail Road, Lahore.", "DealershipContact": "(042) 35875050, 35873030", "DealershipLatitude": 31.5206510, "DealershipLongitude": 74.3424220, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Suzuki Motor House", "DealershipAddress": "57, The Mall, Lahore.", "DealershipContact": "(042) 111-200-900, 37357646", "DealershipLatitude": 31.5626120, "DealershipLongitude": 74.3172200, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Suzuki Ravi Motors", "DealershipAddress": "182 Bund Road, Near (Batti Wala Chowk), Lahore.", "DealershipContact": "(042) 37708808-9, 37705446, 37701802", "DealershipLatitude": 31.6011640, "DealershipLongitude": 74.2961600, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Suzuki Township", "DealershipAddress": "Main PECO Road, Township, Lahore.", "DealershipContact": "(042) 35843995 – 7", "DealershipLatitude": 31.4605900, "DealershipLongitude": 74.3298910, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Mini Motors", "DealershipAddress": "54, Industrial Area, Gulberg-III, Lahore.", "DealershipContact": "(042) 35245750-51-52-53, Fax# 042-35245754", "DealershipLatitude": 31.5009950, "DealershipLongitude": 74.3580440, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Suzuki Raiwind Motors", "DealershipAddress": "16 Km, Main Raiwind Road, Lahore.", "DealershipContact": "(042) 35324195-96", "DealershipLatitude": 31.4181160, "DealershipLongitude": 74.2308430, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Suzuki Gujranwalla Motors", "DealershipAddress": "3-A, Small Industrial Estate, G.T. Road, Gujranwala.", "DealershipContact": "(055) 3733001-3", "DealershipLatitude": 32.1826770, "DealershipLongitude": 74.1792370, "MapZoomLevel": 10, "DealershipCity": "Gujranwala" }, { "DealershipName": "Suzuki Falcon Motors", "DealershipAddress": "Lahore Road, Sargodha.", "DealershipContact": "(048) -3222031-5", "DealershipLatitude": 32.0745570, "DealershipLongitude": 72.6724150, "MapZoomLevel": 10, "DealershipCity": "Sargodha" }, { "DealershipName": "Jani Motors", "DealershipAddress": "Sarghodha Road, Mianwali.", "DealershipContact": "0459-350555-58", "DealershipLatitude": 32.5643020, "DealershipLongitude": 71.5485050, "MapZoomLevel": 10, "DealershipCity": "Mianwali" }, { "DealershipName": "Mangla Autos", "DealershipAddress": "Industrial Area Sector D-I, Mirpur (AJK)", "DealershipContact": "(058610) 47690, 47691", "DealershipLatitude": 33.1486550, "DealershipLongitude": 73.7277460, "MapZoomLevel": 10, "DealershipCity": "Mirpur" }, { "DealershipName": "Suzuki Rawalpindi Motors", "DealershipAddress": "D-Block, 6th Road, Rawalpindi.", "DealershipContact": "(051) 111-222-700", "DealershipLatitude": 33.6423480, "DealershipLongitude": 73.0737590, "MapZoomLevel": 10, "DealershipCity": "Rawalpindi" }, { "DealershipName": "Kazmi Corporation", "DealershipAddress": "147/1, Murree Road, Rawalpindi.", "DealershipContact": "(051) 5120609, 5568591", "DealershipLatitude": 33.5971410, "DealershipLongitude": 73.0604450, "MapZoomLevel": 10, "DealershipCity": "Rawalpindi" }, { "DealershipName": "Central Motors", "DealershipAddress": "Sowan Camp, G.T. Road, Rawalpindi", "DealershipContact": "4917112-7", "DealershipLatitude": 33.5426910, "DealershipLongitude": 73.1086170, "MapZoomLevel": 10, "DealershipCity": "Rawalpindi" }, { "DealershipName": "Azim Motors", "DealershipAddress": "94-B, Street No. 7, I-10/3, Islamabad.", "DealershipContact": "(051) 4432259, 4440303", "DealershipLatitude": 33.6531910, "DealershipLongitude": 73.0378170, "MapZoomLevel": 10, "DealershipCity": "Islamabad" }, { "DealershipName": "I.G Motors", "DealershipAddress": "C-15, Block-20, F.B. Area, Karachi.", "DealershipContact": "(021) 36808871-3, 36805935-7, (021) 111-717-273", "DealershipLatitude": 24.9431450, "DealershipLongitude": 67.0837530, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Riaz Motors", "DealershipAddress": "273/1 Korangi Creek, Near CBM Karachi.", "DealershipContact": "(021) 35122190-3", "DealershipLatitude": 24.8088430, "DealershipLongitude": 67.1224310, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Federal Motors", "DealershipAddress": "Plot No. 8-Khayaban-e-Suharwardhy, Sector G-6-1/1, Islamabad.", "DealershipContact": "(051) 2876306-7, 2874092", "DealershipLatitude": 33.7051170, "DealershipLongitude": 73.0845090, "MapZoomLevel": 10, "DealershipCity": "Islamabad" }, { "DealershipName": "Suzuki Islamabad Motors", "DealershipAddress": "Plot No. 376, I-9 Industrial Area, Islamabad.", "DealershipContact": "(051) 4434538, 4434013, 4434339", "DealershipLatitude": 33.6580490, "DealershipLongitude": 73.0571720, "MapZoomLevel": 10, "DealershipCity": "Islamabad" }, { "DealershipName": "Suzuki Taxila Motors", "DealershipAddress": "Main G.T. Road, Taxila Cantt.", "DealershipContact": "(051) 453009", "DealershipLatitude": 33.7123990, "DealershipLongitude": 72.8128980, "MapZoomLevel": 10, "DealershipCity": "Taxila" }, { "DealershipName": "Suzuki Abbottabad Motors", "DealershipAddress": "Pindi Mansehra Road, Silhad Town, Abbottabad.", "DealershipContact": "(0992) 343040", "DealershipLatitude": 34.1229780, "DealershipLongitude": 73.1906600, "MapZoomLevel": 10, "DealershipCity": "Abbottabad" }, { "DealershipName": "Tayyab Motors", "DealershipAddress": "Manzil-e-Habib, Tehkal Bala Jamrud Road, (University Road) Peshawar", "DealershipContact": "(091) 5840672-3", "DealershipLatitude": 34.0069220, "DealershipLongitude": 71.5088400, "MapZoomLevel": 10, "DealershipCity": "Peshawar" }, { "DealershipName": "Sarwar Automobiles", "DealershipAddress": "12, Saddar Road, Peshawar, Cantt.", "DealershipContact": "(091) 5272463, 5279702", "DealershipLatitude": 34.0000550, "DealershipLongitude": 71.5409410, "MapZoomLevel": 10, "DealershipCity": "Peshawar" }, { "DealershipName": "Frontier Motors", "DealershipAddress": "East Circular Road, D.I. Khan.", "DealershipContact": "(0966) 710730, 714007", "DealershipLatitude": 31.8307530, "DealershipLongitude": 70.9122200, "MapZoomLevel": 10, "DealershipCity": "D.I. Khan" }, { "DealershipName": "Suzuki Quetta Motors", "DealershipAddress": "Main Airport Road, Quetta.", "DealershipContact": "(081) 2864601-4", "DealershipLatitude": 30.2434230, "DealershipLongitude": 66.9862600, "MapZoomLevel": 10, "DealershipCity": "Quetta" }, { "DealershipName": "Suzuki Mardan Motors", "DealershipAddress": "Near Nazim-e-Aala Office, Nowshehra Road, Mardan.", "DealershipContact": "(0931) 874081-2", "DealershipLatitude": 34.1804770, "DealershipLongitude": 72.0345000, "MapZoomLevel": 10, "DealershipCity": "Mardan" }, { "DealershipName": "Suzuki Gujrat Motors", "DealershipAddress": "Adjacent Forest Colony, Gillani, G.T. Road, Gujrat.", "DealershipContact": "053-3568002-4", "DealershipLatitude": 32.6268700, "DealershipLongitude": 73.9973830, "MapZoomLevel": 10, "DealershipCity": "Gujrat" }, { "DealershipName": "Suzuki Cantt Motors", "DealershipAddress": "Bedian Road, Lahore", "DealershipContact": "(042) 35749815-7", "DealershipLatitude": 31.4662450, "DealershipLongitude": 74.4238330, "MapZoomLevel": 10, "DealershipCity": "Lahore" }, { "DealershipName": "Suzuki D.G.Khan Motors", "DealershipAddress": "Main Multan Road, Dera Ghazi Khan", "DealershipContact": "064-2689201-2", "DealershipLatitude": 30.0396750, "DealershipLongitude": 70.6566810, "MapZoomLevel": 10, "DealershipCity": "Dera Ghazi Khan" }, { "DealershipName": "Suzuki Okara Motors", "DealershipAddress": "Lahore Road. Besides Punjab College, Okara.", "DealershipContact": "044-2700505-6", "DealershipLatitude": 30.8222480, "DealershipLongitude": 73.4799530, "MapZoomLevel": 10, "DealershipCity": "Okara" }, { "DealershipName": "Suzuki Makli Motors", "DealershipAddress": "Main Makli Bypass, Thatta, Sindh", "DealershipContact": "0321-2591801", "DealershipLatitude": 24.7414530, "DealershipLongitude": 67.8798870, "MapZoomLevel": 10, "DealershipCity": "Makli" }, { "DealershipName": "Suzuki Sukkur Motors", "DealershipAddress": "409, near Sukkur bypass, Main National Highway at buberlo.", "DealershipContact": "0243-558100, 558044", "DealershipLatitude": 27.6810960, "DealershipLongitude": 68.8430790, "MapZoomLevel": 10, "DealershipCity": "Sukkur" }, { "DealershipName": "Suzuki Peshawar Motors", "DealershipAddress": "Ring Road, Hayat abad Peshawar", "DealershipContact": "091-5231177, 091-5231188", "DealershipLatitude": 33.9887410, "DealershipLongitude": 71.4432330, "MapZoomLevel": 10, "DealershipCity": "Peshawar" }, { "DealershipName": "Suzuki Chakwal Motors", "DealershipAddress": "Near Murid Air Base, Talagang Road, Chakwal.", "DealershipContact": "0543-425000", "DealershipLatitude": 32.9208080, "DealershipLongitude": 72.7885440, "MapZoomLevel": 10, "DealershipCity": "Chakwal" }, { "DealershipName": "Suzuki Attock Motors", "DealershipAddress": "G.T. Road Kamra Cantt, Attock", "DealershipContact": "057-2031244, 057-2031255", "DealershipLatitude": 33.8711280, "DealershipLongitude": 72.3791310, "MapZoomLevel": 10, "DealershipCity": "Attock" }, { "DealershipName": "Suzuki Jhelum Motors", "DealershipAddress": "Opposite Pakistan Tobacco Factory, G. T. Road, Jhelum.", "DealershipContact": "0544-649270, 649275, 649276, 649362", "DealershipLatitude": 32.9774920, "DealershipLongitude": 73.6834790, "MapZoomLevel": 10, "DealershipCity": "Jhelum" }, { "DealershipName": "Suzuki International Motors", "DealershipAddress": "Zaghoon Road, Quetta", "DealershipContact": "081-2444434-7", "DealershipLatitude": 30.1747380, "DealershipLongitude": 66.9983200, "MapZoomLevel": 10, "DealershipCity": "Quetta" }, { "DealershipName": "Habib Motors", "DealershipAddress": "4KM- Khan Pur Road, Sultan Pur Rahim Yar Khan.", "DealershipContact": "068-5039953", "DealershipLatitude": 28.4403930, "DealershipLongitude": 70.3518100, "MapZoomLevel": 10, "DealershipCity": "Rahim Yar Khan" }, { "DealershipName": "Suzuki Rahim Yar Khan Motors", "DealershipAddress": "5-7 Shahbazpur Road, Rahim Yar Khan", "DealershipContact": "068-5885552-4", "DealershipLatitude": 28.4223910, "DealershipLongitude": 70.2915570, "MapZoomLevel": 10, "DealershipCity": "Rahim Yar Khan" }, { "DealershipName": "Suzuki North Motors", "DealershipAddress": "F-94, Block-B, North Nazimabad, Karachi", "DealershipContact": "021-36640703-7", "DealershipLatitude": 24.9303710, "DealershipLongitude": 67.0398080, "MapZoomLevel": 10, "DealershipCity": "Karachi" }, { "DealershipName": "Suzuki Chenab Motors", "DealershipAddress": "3-KM Faisalabad Road, Jhang Saddar.", "DealershipContact": "047-7625871-3", "DealershipLatitude": 31.2798710, "DealershipLongitude": 72.3599050, "MapZoomLevel": 10, "DealershipCity": "Jhang" }, { "DealershipName": "Suzuki Muzaffarabad Motors", "DealershipAddress": "Main G.T. Raod Ambore, Muzaffarabad", "DealershipContact": "05822-432496-8", "DealershipLatitude": 34.3313700, "DealershipLongitude": 73.4669070, "MapZoomLevel": 10, "DealershipCity": "Muzaffarabad" }, { "DealershipName": "Suzuki Capital Motors", "DealershipAddress": "Plot No 1-E, Industrial Area Triangle, Kahuta Raod, Humak, Islamabad.", "DealershipContact": "+92-(51) 4492341-43 UAN (051) 111 260 260", "DealershipLatitude": 33.5432370, "DealershipLongitude": 73.1681080, "MapZoomLevel": 10, "DealershipCity": "Islamabad" }, { "DealershipName": "Suzuki Burj Motors", "DealershipAddress": "New Civil Line, Behind Sindbad, Faisalabad.", "DealershipContact": "041-8580010-12", "DealershipLatitude": 31.4339000, "DealershipLongitude": 73.0880820, "MapZoomLevel": 10, "DealershipCity": "Faisalabad" }, { "DealershipName": "Suzuki Larkana Motors", "DealershipAddress": "Opposite Palyo Gopang Village, Larkana-Ratodero Road, Larkana, Sindh, Pakistan", "DealershipContact": "074-4161501/02", "DealershipLatitude": 27.6277260, "DealershipLongitude": 68.2386590, "MapZoomLevel": 10, "DealershipCity": "Larkana" }, { "DealershipName": "Suzuki Shinwari Motors", "DealershipAddress": "Near Phase III Chowk, Hayatabad Jamrud Road, Peshawar.", "DealershipContact": "(091) 5851000", "DealershipLatitude": 33.9948960, "DealershipLongitude": 71.4997100, "MapZoomLevel": 10, "DealershipCity": "Peshawar" }, { "DealershipName": "Suzuki Sadiqabad Motors", "DealershipAddress": "Near Taj Chowk, Ahmad pur Lamma Road., Sadiqabad", "DealershipContact": "0300-8770550", "DealershipLatitude": 28.4282410, "DealershipLongitude": 70.3200530, "MapZoomLevel": 10, "DealershipCity": "Sadiqabad" }, { "DealershipName": "Suzuki Khanewal Motors", "DealershipAddress": "Jahanian Bypass, Lahore More, Khanewal.", "DealershipContact": "065-2556882-4", "DealershipLatitude": 30.6272770, "DealershipLongitude": 73.1325530, "MapZoomLevel": 10, "DealershipCity": "Khanewal" }, { "DealershipName": "Suzuki Samanabad Motors", "DealershipAddress": "44/45, main samanabad, Lahore.", "DealershipContact": "042-111-200-700 / 042-37576015-19 / 042-7576020", "DealershipLatitude": 29.3552470, "DealershipLongitude": 71.6404720, "MapZoomLevel": 10, "DealershipCity": "Lahore" } ]');
                var success = function (position) {
                    var coords = position.coords;
                    //var coords = { latitude: 24.837495, longitude: 67.081433 };
                    var coordsDealer = { latitude: $scope.DealersList[0].DealershipLatitude, longitude: $scope.DealersList[0].DealershipLongitude };
                    GetDistance($scope.DealersList, 0, coords, coordsDealer);
                }
                var error = function (error) {
                    navigator.notification.alert("Error location your location: " + error.messgae, "INFORMATION");
                }
                var opeco = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
                navigator.geolocation.getCurrentPosition(success, error, opeco);
            }

            function GetDistance(pDealersList, index, coords, dealercords) {
                var markers = [
                 {
                     "title": 'Your Current Location',
                     "lat": coords.latitude,
                     "lng": coords.longitude,
                     "description": 'Current'
                 }];

                var origin = new google.maps.LatLng(markers[0].lat, markers[0].lng);               

                var service = new google.maps.DistanceMatrixService();
                var distanceCalculated = null;
                var durationCalculated = null;

                var dealersDestinations = [];
                //var pDelearLength = pDealersList.length;
                //var indexLen = index + 24;
                //var calLength = pDelearLength - indexLen;

                
                for (var i = index; (i <= index + 24) && (i <= $scope.DealersList.length-1) ; i++) {
                    var destinationLocal = new google.maps.LatLng(pDealersList[i].DealershipLatitude, pDealersList[i].DealershipLongitude);
                    dealersDestinations.push(destinationLocal);
                }
                service.getDistanceMatrix(
                  {
                      origins: [origin],
                      destinations: dealersDestinations,
                      travelMode: google.maps.TravelMode.DRIVING,
                  }, function callback(response, status) {
                      if (status == google.maps.DistanceMatrixStatus.OK) {
                          var originList = response.originAddresses;
                          var destinationList = response.destinationAddresses;

                          for (var i = 0; i < originList.length; i++) {
                              var results = response.rows[i].elements;
                              
                              for (var j = 0; j < results.length; j++) {
                                  pDealersList[j + index].Duration = results[j].duration.text;
                                  pDealersList[j + index].Distance = results[j].distance.text;
                                  pDealersList[j + index].DistanceValue = results[j].distance.value;
                              }
                          }
                          if (index < 75) {
                              GetDistance(pDealersList, index + 25, coords, dealercords)
                          }
                          else {

                              $scope.DealersList = pDealersList;
                              $scope.$apply();
                              $scope.DealersList.sort(function (a, b) {
                                  if (a.DistanceValue == b.DistanceValue) { return 0; }
                                  if (a.DistanceValue > b.DistanceValue) {
                                      return 1;
                                  }
                                  else {
                                      return -1;
                                  }
                              });

                              for (var j = 0; j < pDealersList.length; j++) {
                                  pDealersList[j].Index = j +1;                                  
                              }

                              if ($scope.RecordLimit != 0) {
                                  $scope.DealersList = $scope.DealersList.slice(0, $scope.RecordLimit);
                                  //$scope.DealersListSorted = $scope.DealersList;
                              }
                              //else {
                              //    $scope.DealersListSorted = $scope.DealersList;
                              //}


                              $scope.page = 0;
                              $scope.pagesCount = parseInt(Math.ceil($scope.DealersList.length / $scope.pageSize));
                              $scope.totalCount = $scope.DealersList.length;
                              $scope.DealersListSorted = $scope.DealersList.slice(0, $scope.pageSize);

                              $scope.$apply();
                              $('#loadingDealers').hide();
                              $("#dealersList").show();
                              $scope.ResetGrid();
                          }
                      }
                  });
            }

            //function GetDistance(pDealersList, index, coords, dealercords)
            //{
            //    var markers = [
            //     {
            //         "title": 'Your Current Location',
            //         "lat": coords.latitude,
            //         "lng":  coords.longitude,
            //         "description": 'Current'
            //     },               
            //     {
            //         "title": pDealersList[index].DealershipName,
            //         "lat": dealercords.latitude,
            //         "lng": dealercords.longitude,
            //         "description": pDealersList[index].DealershipName
            //     },               
            //    ];

            //    var origin = new google.maps.LatLng(markers[0].lat, markers[0].lng);
            //    var destination = new google.maps.LatLng(markers[1].lat, markers[1].lng);
            //    var service = new google.maps.DistanceMatrixService();
            //    var distanceCalculated = null;
            //    var durationCalculated = null;

            //    service.getDistanceMatrix(
            //      {
            //          origins: [origin],
            //          destinations: [destination],
            //          travelMode: google.maps.TravelMode.DRIVING,
            //      }, function callback(response, status) {
            //          if (status == google.maps.DistanceMatrixStatus.OK) {
            //              var origins = response.originAddresses;
            //              var destinations = response.destinationAddresses;
            //              var elementKAS = response.rows[0].elements;
            //              var distanceCalculated = elementKAS[0].distance.text;
            //              var distanceCalculatedValue = elementKAS[0].distance.value;
            //              var durationCalculated = elementKAS[0].duration.text;
            //              pDealersList[index].Duration = durationCalculated;                          
            //              pDealersList[index].Distance = distanceCalculated;
            //              pDealersList[index].DistanceValue = distanceCalculatedValue;
            //              $scope.DealersList = pDealersList;
            //              $scope.$apply();
            //              index = index + 1;
            //              var totalItems = pDealersList.length;
            //              if (totalItems - 1 >= index) {
            //                  var targetLatLng = { latitude: pDealersList[index].DealershipLatitude, longitude: pDealersList[index].DealershipLongitude };
            //                  GetDistance(pDealersList, index, coords, targetLatLng);
            //              }
            //              else {
            //                  $scope.DealersList.sort(function (a, b) {
            //                      if (a.DistanceValue == b.DistanceValue) { return 0; }
            //                      if (a.DistanceValue > b.DistanceValue) {
            //                          return 1;
            //                      }
            //                      else {
            //                          return -1;
            //                      }
            //                  });
            //                  if ($scope.RecordLimit != 0) {
            //                      $scope.DealersListSorted = $scope.DealersList.slice(0, $scope.RecordLimit);
            //                  }
            //                  else {
            //                      $scope.DealersListSorted = $scope.DealersList;
            //                  }
            //                  $scope.$apply();
            //                  $('#loadingDealers').hide();
            //                  $("#dealersList").show();
            //                  $scope.ResetGrid();
            //              }
            //          }
            //      });                
            //}            
            function DrawMap(coords,dealercords,dealershipName) {
                var markers = [
                 {
                     "title": 'Your Location',
                     "lat": coords.latitude,
                     "lng":  coords.longitude,
                     "description": 'Your Location'
                 },
                 {
                     "title": dealershipName,
                     "lat": dealercords.latitude,
                     "lng":  dealercords.longitude,
                     "description": dealershipName
                 }                               
                ];                
                var mapOptions = {
                    center: new google.maps.LatLng(markers[0].lat, markers[0].lng),
                    zoom: 10,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };                
                var map = new google.maps.Map(document.getElementById("map"), mapOptions);
                var infoWindow = new google.maps.InfoWindow();
                var lat_lng = new Array();
                var latlngbounds = new google.maps.LatLngBounds();
                for (i = 0; i < markers.length; i++) {
                    var data = markers[i]
                    var myLatlng = new google.maps.LatLng(data.lat, data.lng);
                    lat_lng.push(myLatlng);
                    if (markers[i].title == 'Your Location') {                       
                        var image = 'http://paksuzuki.com.pk/Automobile/images/LocationPerson_2.png';
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            icon: image,
                            title: data.title
                        });
                    }
                    else {
                        var image = 'http://paksuzuki.com.pk/Automobile/images/b_suzuki.gif';
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: map,
                            icon: image,
                            title: data.title
                        });
                    }
                    latlngbounds.extend(marker.position);
                    (function (marker, data) {
                        google.maps.event.addListener(marker, "click", function (e) {
                            infoWindow.setContent(data.description);
                            infoWindow.open(map, marker);
                        });
                    })(marker, data);
                }
                map.setCenter(latlngbounds.getCenter());
                map.fitBounds(latlngbounds);

                //***********ROUTING****************//

                //Initialize the Path Array
                var path = new google.maps.MVCArray();

                //Initialize the Direction Service
                var service = new google.maps.DirectionsService();

                //Set the Path Stroke Color
                var poly = new google.maps.Polyline({ map: map, strokeColor: '#4986E7' });

                //Loop and Draw Path Route between the Points on MAP
                for (var i = 0; i < lat_lng.length; i++) {
                    if ((i + 1) < lat_lng.length) {
                        var src = lat_lng[i];
                        var des = lat_lng[i + 1];
                        path.push(src);
                        poly.setPath(path);
                        service.route({
                            origin: src,
                            destination: des,
                            travelMode: google.maps.DirectionsTravelMode.DRIVING
                        }, function (result, status) {
                            if (status == google.maps.DirectionsStatus.OK) {
                                for (var i = 0, len = result.routes[0].overview_path.length; i < len; i++) {
                                    path.push(result.routes[0].overview_path[i]);
                                }
                            }
                        });
                    }
                }

                //GET Distance
                var origin1 = new google.maps.LatLng(markers[0].lat, markers[0].lng);
                //var origin2 = "Karachi, Pakistan";
                //var destinationA = "Karachi, Pakistan";
                var destinationB = new google.maps.LatLng(markers[1].lat, markers[1].lng);

                var service = new google.maps.DistanceMatrixService();
                service.getDistanceMatrix(
                  {
                      origins: [origin1],
                      destinations: [destinationB],
                      travelMode: google.maps.TravelMode.DRIVING,                      
                  }, function callback(response, status){
                      if (status == google.maps.DistanceMatrixStatus.OK) {
                          var origins = response.originAddresses;
                          var destinations = response.destinationAddresses;

                          var elementKAS = response.rows[0].elements;
                          var distanceKAS = elementKAS[0].distance.text;
                          var durationKAS = elementKAS[0].duration.text;
                          $('#lblDis').show();                          
                          document.getElementById("lblDistance").innerHTML = "Distance: ";
                          document.getElementById("lblDistance").innerHTML = "Distance: " + distanceKAS;
                          document.getElementById("lblDuration").innerHTML = "Duration: ";
                          document.getElementById("lblDuration").innerHTML = "Duration: " + durationKAS;
                          //alert(distanceKAS);
                          for (var i = 0; i < origins.length; i++) {
                              var results = response.rows[i].elements;
                              for (var j = 0; j < results.length; j++) {
                                  var element = results[j];
                                  var distance = element.distance.text;
                                  var duration = element.duration.text;
                                  var from = origins[i];
                                  var to = destinations[j];                                  
                              }
                          }
                      }
                  });               
            }        
            function distance() {            
                var success = function (position) {
                    var coords = position.coords;
                    var myLatLng = { lat: coords.latitude, lng: coords.longitude };                
                    DrawMap(coords);                
                }
                var error = function (error) {
                    navigator.notification.alert("Error location your location: " + error.messgae, "INFORMATION");
                }

                var opeco = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
                navigator.geolocation.getCurrentPosition(success, error, opeco);
            }
            function cordinates() {
                $('#lblDis').hide();
                $("#dealersList").hide();
                $("#map").show();

                var success = function (position) {
                    var coords = position.coords;
                    //var coords = { latitude: 24.837495, longitude: 67.081433 };
                    var myLatLng = { lat: coords.latitude, lng: coords.longitude };
                    var map = new google.maps.Map(
                        document.getElementById("map"),
                        {   
                            center: myLatLng,
                            zoom: 16                        
                        }                    
                    );                                   
                    var image = 'http://paksuzuki.com.pk/Automobile/images/LocationPerson_2.png';
                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        icon: image,
                        title: 'Your Location'
                    });

                    
                    google.maps.event.addListener(marker, "click", function (e) {
                        var infoWindow = new google.maps.InfoWindow();
                            infoWindow.setContent(marker.title);
                            infoWindow.open(map, marker);
                        });
                    

                    var labelText = "City Hall";
                    var myOptions = {
                        content: labelText
                        , boxStyle: {
                            border: "1px solid black"
                          , textAlign: "center"
                          , fontSize: "8pt"
                          , width: "50px"
                        }
                        , disableAutoPan: true
                        , pixelOffset: new google.maps.Size(-25, 0)
                        , position: myLatLng
                        , closeBoxURL: ""
                        , isHidden: false
                        , pane: "mapPane"
                        , enableEventPropagation: true
                    };

                    var ibLabel = new InfoBox(myOptions);
                    ibLabel.open(map);
                  
                }
                var error = function (error) {
                    navigator.notification.alert("Error location your location: " + error.messgae, "INFORMATION");
                }

                var opeco = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };
                navigator.geolocation.getCurrentPosition(success, error, opeco);
            }
        };
        function cordinatesPSMCL() {
            $('#lblDis').hide();
            var myLatLng = { lat: 24.834000, lng: 67.336246 };
            var map = new google.maps.Map(
                document.getElementById("map"),
                {   
                    center: myLatLng,
                    zoom: 16                        
                }                    
            );                

            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'PSMCL LOCATION'
            });
        }
        function setRandomColor(e) {
            //alert('sss');
            var bodyElement = document.querySelector("body");        
            bodyElement.style.backgroundColor = getRandomColor();
        }

        function getRandomColor()
        {
            var r = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);

            var hexR = r.toString(16);
            var hexB = b.toString(16);
            var hexG = g.toString(16);

            if (hexR.length == 1)
            {
                hexR = "0" + hexR;
            }
            if (hexB.length == 1) {
                hexB = "0" + hexB;
            }
            if (hexG.length == 1) {
                hexG = "0" + hexG;
            }
            var hexColor = "#" + hexR + hexB + hexG;
            return hexColor.toUpperCase();
        }
        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        };

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        };
    })
} )();