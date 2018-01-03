var MapWrapper = require('./models/mapWrapper');

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
