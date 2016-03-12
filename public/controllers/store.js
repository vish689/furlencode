angular.module('MyApp')
.controller('storeCtrl', function ($scope, $location, $auth, toastr, Account, $state,StoreService) {
  $scope.store = {
    name:'',
    description:'',
    address:'',
    coord: [],
    category:[]
  };

  /*var global_address;
  var global_latLng;
  $scope.initMap = function(){
    var myLatLng = {
      lat : -25.363,
      lng : 131.044
    };

    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    var marker;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom : 4,
        center : myLatLng
    });
            
    centerLocation({'address': 'Bangalore'});

    google.maps.event.addListener(map, 'click', function(event) {
        getLocation(event.latLng, map);
    });

    function getLocation(latLng, map) {
      global_address = null;
      global_latLng = null;
      geocoder.geocode({
        'location' : latLng
      }, function(results, status) {
      if (results[1]) {
        map.setZoom(11);
        if (marker != null) {
          marker.setMap(null);
        }
        marker = new google.maps.Marker({
            position : latLng,
            map : map
        })
        infowindow.setContent(results[1].formatted_address);
        infowindow.open(map, marker);
        global_latLng = latLng;
        global_address = results[1].formatted_address;
        console.log("ADDRESS : " + global_address);
        console.log("LATLNG : " + global_latLng.lat());
        $scope.$apply(function () {
          $scope.store.address = global_address ; 
          $scope.store.coord[0] = global_latLng.lng();
          $scope.store.coord[1] = global_latLng.lat();
        });
            }
      });
    }
            
    function centerLocation(location) {
      geocoder.geocode(location, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
              map.setCenter(results[0].geometry.location);
              map.setZoom(11);
          }
      })
    }
  }*/
  var global_address;
  var global_latLng;
  var current_latLng;
  var isUpdate = false;
  $scope.initMap= function(){
    var myLatLng = {
        lat : -25.363,
        lng : 131.044
    };

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;

    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    var marker;
    var centerMarker;
    var nearbyMarkers = [];
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom : 4,
        center : myLatLng
    });

    directionsDisplay.setMap(map);
    var directionOptions = {
            suppressMarkers: true
    };
    directionsDisplay.setOptions(directionOptions);

    getDirection = function () {
        console.log("ORIGIN : " + centerMarker.getPosition());
        console.log("DESTINATION : " + marker.getPosition());
        directionsService.route({
            origin : centerMarker.getPosition(),
            destination : marker.getPosition(),
            travelMode : google.maps.TravelMode.DRIVING
        }, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to '
                        + status);
            }

        });
    }
    
    setCenterMarker = function (location) {
        if (centerMarker != null) {
            centerMarker.setMap(null);
        }
        centerMarker = new google.maps.Marker(
                {
                    position : location,
                    animation : google.maps.Animation.DROP,
                    icon : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                    draggable : true,
                    title: "My Location"
                });
        
         centerMarker.addListener('dragend',function(event) {
             //fgetDirection();
            });
    }

    
    centerLocation = function (location) {
        if (location.address != 'undefined') {
            geocoder
                    .geocode(
                            location,
                            function(results, status) {
                                if (status === google.maps.GeocoderStatus.OK) {
                                    map
                                            .setCenter(results[0].geometry.location);
                                    map.setZoom(11);
                                    setCenterMarker(results[0].geometry.location);
                                }
                            });

        } else if (location.location != 'undefined') {
            map.setCenter(location.location);
            setCenterMarker(location.location);
        }
    }
  
    centerLocation({
        'address' : 'Bangalore'
    });

                
    showPosition = function (position) {
        var centerLocationStr = "Latitude: " + position.coords.latitude
                + "<br>Longitude: " + position.coords.longitude;
        console.log(centerLocationStr);
        centerLocation({
            'location' : {
                lat : position.coords.latitude,
                lng : position.coords.longitude
            }
        });
    }

    getBrowserLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console
                    .log("Geolocation is not supported by this browser.");
        }
    }
  
    centerToBrowserLocation = function () {
        getBrowserLocation();
    }

    centerToBrowserLocation();

    getLocation = function (latLng, map) {
        global_address = null;
        global_latLng = null;
        geocoder.geocode({
            'location' : latLng
        }, function(results, status) {
            if (results[1]) {
                map.setZoom(11);
                if (marker != null) {
                    marker.setMap(null);
                }
                marker = new google.maps.Marker({
                    position : latLng,
                    animation : google.maps.Animation.DROP,
                    map : map,
                    title : "Create new store here !!!"
                });

                infowindow.setContent(results[1].formatted_address);
                infowindow.open(map, marker);
                global_latLng = {
                    'lat' : latLng.lat(),
                    'lng' : latLng.lng()
                }
                global_address = results[1].formatted_address;
                //getDirection();
                console.log("ADDRESS : " + global_address);
                console.log("LATLNG : " + global_latLng);
                $scope.$apply(function () {
                  $scope.store.address = global_address ; 
                  $scope.store.coord[0] = global_latLng.lng;
                  $scope.store.coord[1] = global_latLng.lat;
                });
            }
        });
    }
  
    google.maps.event.addListener(map, 'click', function(event) {
        getLocation(event.latLng, map);
    });

    setNearBy = function (locations) {
        if (locations == null) {
            return;
        }
        if (nearbyMarkers == null) {
            nearbyMarkers = [];
        }
        for (var i = 0; i < locations.length; ++i) {
            var marker = new google.maps.Marker({
                position : latLng,
                animation : google.maps.Animation.DROP,
                map : map
            });
            nearbyMarkers.push(marker);
        }
    }

    clearNearBy = function () {
        if (nearbyMarkers == null) {
            nearbyMarkers = [];
            return;
        }
        for (var i = 0; i < nearbyMarkers.length; ++i) {
            var m = nearbyMarkers[i];
            setTimeout(function() {
                m.setMap(null);
            }, i * 200);
        }
        nearbyMarkers = [];
    }

  }

  window.initMap = $scope.initMap;

  $scope.createStore = function(){
    StoreService.createStore($scope.store)
    .then(function(response) {
      console.log(response);
      toastr.success("Store Added Successfully");
    })
    .catch(function(response) {
      toastr.error(response.data.message, response.status);
    });
  }

  /*
  Get Stores
  */
  $scope.query = {
    address: 'Bangalore',
    longitude: '',
    latitude:''
  },
  /*
  Get Long lat using address
  */
  $scope.getLocation =  function(address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var latitude = results[0].geometry.location.lat();
        var longitude = results[0].geometry.location.lng();
        console.log(latitude, longitude);
        $scope.$apply(function () {
          $scope.query.longitude = longitude;
          $scope.query.latitude = latitude;
        });
        StoreService.getStore($scope.query)
        .then(function(response) {
          console.log(response);
          $scope.stores = response.data;
        })
        .catch(function(response) {
          toastr.error(response.data.message, response.status);
        });
      } 
    }); 
  }
  $scope.getStore = function(){
    console.log("fetching data");
    $scope.getLocation($scope.query.address);
  }
  $scope.getStore();
})

.directive('googleplace', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, model) {
      var options = {
        types: [],
        componentRestrictions: {}
      };
      scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

      google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
        scope.$apply(function () {
            model.$setViewValue(element.val());
        });
      });
    }
  };
});
