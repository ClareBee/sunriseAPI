var MapWrapper = require('./models/mapWrapper');

var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener("load", callback);
  request.send();
}

var requestComplete = function(){
  if(this.status !== 200) return;
  var jsonString = this.responseText;

  var apiData = JSON.parse(jsonString);
  console.log(apiData);
  showSunInfo(apiData);
}

var showSunInfo = function(apiData){
  var sunriseTime = document.getElementById('sunrise');
  sunriseTime.innerHTML = apiData.results.sunrise;
  var sunsetTime = document.getElementById('sunset');
  sunsetTime.innerHTML = apiData.results.sunset;
}

var getLatLong = function(){
  var target = document.getElementById('latitude');
  var lat = document.getElementById('latitude').innerHTML;
  var long = document.getElementById('longitude').innerHTML;
  if(target.className == "locationAdded"){
     var sunriseurl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${long}`;
     makeRequest(sunriseurl, requestComplete);
     target.className = "";
  };
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
  setTimeout(function() {
    getLatLong();
  }, 5000);
  var googlemap = document.getElementById("map");
  googlemap.addEventListener('change', function(){
    getLatLong();
  });
}

window.addEventListener('load', app);
