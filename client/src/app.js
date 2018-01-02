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
