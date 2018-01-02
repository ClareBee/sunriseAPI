/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var MapWrapper = __webpack_require__(1);

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener("load", callback);
  request.send();
}

var requestComplete = function(){
  if(this.status !== 200) return;
  var jsonString = this.responseText;

  var results = JSON.parse(jsonString);
  console.log(results);
  alert('app is working');
}

var createMap = function(){
  var container = document.getElementById("map");
  var center = { lat: 56.740674, lng: -4.2187500 };
  var zoom = 7;
  mainMap = new MapWrapper(container, center, zoom);

  // geolocation
  mainMap.userLocation();
  // search box
  mainMap.createSearchBox();
};


var app = function(){
  createMap();
  var latitude = 36.7201600;
  var longitude = -4.4203400;
  var url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`;
  var map = new
  makeRequest(url, requestComplete);

}

window.addEventListener('load', app);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

var MapWrapper = function(container, coords, zoom){
  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: zoom
  });
  this.directionInfoWindow = [];
  this.markers = [];
  //new markers will contain user location or search location
  this.newMarkers = [];
  this.directionDisplay = new google.maps.DirectionsRenderer({
    map: this.googleMap,
    markerOptions: {
      zIndex: -15,
      visible: false
    }
  });
  this.directionsShowing = true;
};


MapWrapper.prototype.createSearchBox = function(){
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  this.googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  searchBox.addListener('bounds_changed', function() {
    searchBox.setBounds(this.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    };
    // For each place, get the icon, name and location.

    var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        var newPlace = place;
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        };

    this.createMarker(newPlace);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }.bind(this));
    this.googleMap.fitBounds(bounds);
  }.bind(this));
}

MapWrapper.prototype.createMarker = function(place){
  var icon = {
    url: place.icon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  };
  var newMarker = new google.maps.Marker({
    map: this.googleMap,
    title: place.name,
    icon: icon,
    position: place.geometry.location
  });
};

MapWrapper.prototype.userLocation = function(){
  navigator.geolocation.getCurrentPosition(function(position){
    var coords = {lat: position.coords.latitude, lng: position.coords.longitude};
    this.googleMap.setCenter(coords);
    this.googleMap.setMapTypeId("roadmap");
    this.googleMap.setZoom(14);
    var marker = new google.maps.Marker({
      position: coords,
      infoWindowOpen: false,
      map: this.googleMap
  });

    var contentString = '<div id="content">' +
    '<div id="bodyContent">' +
    `<h3 id="user-loc">You are here</h3>` +
    '</div>' +
    '</div>';
    marker.infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker.infowindow.open(this.googleMap, marker);
    marker.infowindowOpen = true;
    this.newMarkers.push(marker);
  }.bind(this));
};

module.exports = MapWrapper;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map