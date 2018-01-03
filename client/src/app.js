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

var requestCompleteFavSun = function(){
  if (this.status !== 200) return console.log("request failed");
  console.log('api accessed');
  var jsonString = this.responseText;
  var apiData = JSON.parse(jsonString);
  displayFavSun(apiData);
}

var displayFavSun = function(apiData){
  var time = document.getElementById("time");
  time.textContent = apiData.results.sunrise;
  var labelForTime = document.getElementById("hidden");
  labelForTime.classList.toggle('show');
}

var showFavInfo = function(dbData){
  for(fav of dbData){
    var ul = document.getElementById("fav-list");
    var li = document.createElement("li");
    // li.addEventListener("click", function(){
    // var input = this.getElementsByTagName('input');
    // var lat = input[0].value.split(',')[0];
    // var long = input[0].value.split(',')[1];
    // var newUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${long}`;
    // makeRequest(newUrl, requestCompleteFavSun);
    // });
    li.className = "list-group-item";
    li.innerHTML = '<form action="/places/' + fav._id + '/delete" method="POST"><input type="hidden" value="' + fav.latitude + ',' + fav.longitude + '">' + fav.name + '<button type="submit" class="pull-right btn btn-secondary">Delete</button></form><button id="sunriseBtn" type="button" class="searchBtn btn btn-primary pull-right"> Get sunrise</button>';
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
  var lat = document.getElementById('latitude').value;
  var long = document.getElementById('longitude').value;
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
  }, 4500);

  var googlemap = document.getElementById("map");
  googlemap.addEventListener('change', function(){
    getLatLong();
  });
  $(function () {
    $('[data-toggle="popover"]').popover()
  });
  $('.popover-dismiss').popover({
  trigger: 'focus'
})

};
window.addEventListener('load', app);
