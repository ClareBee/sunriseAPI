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
  console.log("request made");
  request.open("GET", url);
  console.log("url accessed");
  request.addEventListener("load", callback);
  request.send();
};

var requestCompleteFav = function(){
  if (this.status !== 200) return console.log("request failed");
  console.log('database accessed');
  var jsonString = this.responseText;
  var dbData = JSON.parse(jsonString);
  console.log(dbData);
  showFavInfo(dbData);
}

var showFavInfo = function(dbData){
  for(fav of dbData){
    var ul = document.getElementById("fav-list");
    var li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = '<form action="/places/' + fav._id + '/delete" method="POST" >' + fav.place + fav.sunrise + '<button type="submit" class="pull-right btn btn-secondary">Delete</button></form>';
    ul.append(li);
  }
};


var requestComplete = function(){
  if(this.status !== 200) return;
  var jsonString = this.responseText;
  var apiData = JSON.parse(jsonString);
  console.log(apiData);
  showSunInfo(apiData);
  calculateTime(apiData);
};

var showSunInfo = function(apiData){
  var sunriseTime = document.getElementById('sunrise');
  sunriseTime.innerHTML = apiData.results.sunrise;
  var sunsetTime = document.getElementById('sunset');
  sunsetTime.innerHTML = apiData.results.sunset;
};

var getLatLong = function(){
  var target = document.getElementById('latitude');
  var lat = document.getElementById('latitude').innerHTML;
  var long = document.getElementById('longitude').innerHTML;
  if(target.className == "locationAdded"){
     var sunriseurl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${long}`;
     makeRequest(sunriseurl, requestComplete);
     target.className = "";
  };
};

var calculateTime = function(apiData){
  var presentTime = new Date().toLocaleTimeString({hour12: false});
  console.log(presentTime);
  var sunriseTime = apiData.results.sunrise;
  console.log(sunriseTime)

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
  window.scrollTo(0, 0);
  var url = "/places";
  makeRequest(url, requestCompleteFav);

  createMap();
  setTimeout(function() {
    getLatLong();
  }, 5000);

  var googlemap = document.getElementById("map");
  googlemap.addEventListener('change', function(){
    getLatLong();
  });
};
window.addEventListener('load', app);


/***/ }),
/* 1 */
/***/ (function(module, exports) {


var MapWrapper = function(container, coords, zoom){
  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: zoom,
    styles:  [{
            elementType: 'geometry',
            stylers: [{color: '#f5f5f5'}]
          },
          {
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{color: '#616161'}]
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{color: '#f5f5f5'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#bdbdbd'}]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#eeeeee'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#757575'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#e5e5e5'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#ffffff'}]
          },
          {
            featureType: 'road.arterial',
            elementType: 'labels.text.fill',
            stylers: [{color: '#757575'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#dadada'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#616161'}]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#e5e5e5'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#eeeeee'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#c9c9c9'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          }
      ]
  });

  this.markers = [];
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
    this.streetView(place.geometry.location);

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }.bind(this));
    this.googleMap.fitBounds(bounds);
  }.bind(this));
};
MapWrapper.prototype.getLocationName = function(place){
  var location = document.getElementById('placeName');
  console.log(place);
  if(place.name == null){
    location.innerHTML = "Your location";
  } else {
    location.innerHTML = place.name;
  }
};
MapWrapper.prototype.removeMarker = function(){
  if(this.markers.length >= 1){
    var last = this.markers.pop();
    last.setMap(null);
  }else{
    console.log("nothing to remove");
  };
};

MapWrapper.prototype.createMarker = function(place){
  this.removeMarker();
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
  this.getLocationName(place);
  var locate = place.geometry.location;
  var newLocationString = '<div class="content">' +
      '<div class="bodyContent">' +
      `<h4>Your new location</h4>` +
      `<p>Lat: ${locate.lat().toFixed(4)} <br> Lng: ${locate.lng().toFixed(4)}</p>` +
      '</div>' +
      '</div>';
  newMarker.infowindow = new google.maps.InfoWindow({
    content: newLocationString
  });
  newMarker.infowindow.open(this.googleMap, newMarker);
  this.markers.push(newMarker);
  this.showCoords(newMarker);
};
MapWrapper.prototype.streetView = function(location){
  var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), {
            position: location,
            pov: {
              heading: 165,
              pitch: 0,
              zoom: 1
            },
            visible: true
          });
  this.googleMap.setStreetView(panorama);
};
MapWrapper.prototype.showCoords = function(marker){
  var lat = document.getElementById("latitude");
  var long = document.getElementById("longitude");
  lat.className = "locationAdded";
  lat.innerHTML = marker.position.lat();
  long.innerHTML = marker.position.lng();
}

MapWrapper.prototype.userLocation = function(){
  navigator.geolocation.getCurrentPosition(function(position){
    var coords = {lat: position.coords.latitude, lng: position.coords.longitude};
    this.googleMap.setCenter(coords);
    this.googleMap.setMapTypeId("roadmap");
    this.googleMap.setZoom(14);
    var marker = new google.maps.Marker({
      position: coords,
      infoWindowOpen: false,
      map: this.googleMap,
    });
    this.markers.push(marker);
    this.getLocationName(position);
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
    this.showCoords(marker);
  }.bind(this));

};

module.exports = MapWrapper;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map