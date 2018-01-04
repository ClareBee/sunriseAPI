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
  labelForTime.classList.toggle("showing");
}

var showFavInfo = function(dbData){
  for(fav of dbData){
    var ul = document.getElementById("fav-list");
    var li = document.createElement("li");
    li.className = "list-group-item";
    li.innerHTML = '<form action="/places/' + fav._id + '/delete" method="POST"><input type="hidden" value="' + fav.latitude + ',' + fav.longitude + '">' + fav.name + '<button type="submit" class="pull-right btn btn-secondary">Delete</button></form>';
    var searchButton = document.createElement('button');
    searchButton.innerHTML = '<button id="sunriseBtn" type="button" class="searchBtn btn btn-primary"> Get sunrise</button>';
    searchButton.style.marginTop = "20px";
    searchButton.style.fontSize = "200%";
    li.append(searchButton);
    searchButton.addEventListener("click", function(){
      var input = this.previousSibling.childNodes[0];
      var lat = input.value.split(',')[0];
      var long = input.value.split(',')[1];
      var newUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${long}`;
      makeRequest(newUrl, requestCompleteFavSun);
    });
    ul.append(li);
  }
};


var requestComplete = function(){
  if(this.status !== 200) return;
  var jsonString = this.responseText;
  var apiData = JSON.parse(jsonString);
  console.log(apiData);
  showSunInfo(apiData);
};

var showSunInfo = function(apiData){
  var sunriseTime = document.getElementById('sunrise');
  sunriseTime.innerHTML = apiData.results.sunrise;
  var sunsetTime = document.getElementById('sunset');
  sunsetTime.innerHTML = apiData.results.sunset;
  calculateTime(apiData);
};

var getLatLong = function(){
  var marker = mainMap.markers[0];
  var lat = marker.position.lat();
  var long = marker.position.lng();
  var sunriseurl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${long}`;
  makeRequest(sunriseurl, requestComplete);
};

var calculateTime = function(apiData){
  var presentTime = new Date().toLocaleTimeString({hour12: false});
  var numericalTimeNow = presentTime.split(":");
  var minsNow = parseInt(numericalTimeNow[0]) * 60 + parseInt(numericalTimeNow[1]);
  var sunriseTime = apiData.results.sunrise;
  var mins = 0;
  var hoursToGo = 0;
  if(sunriseTime.match(/PM/)){
    var newTime = sunriseTime.trim().slice(0, -2);
    var numericalTime = newTime.split(":");
    mins = parseInt(numericalTime[0]) * 60 + parseInt(numericalTime[1]) + (12 * 60);
  } else {
    var newTime = sunriseTime.trim().slice(0, -2);
    var numericalTime = newTime.split(":");
    mins = parseInt(numericalTime[0]) * 60 + parseInt(numericalTime[1]);
  }
  if(minsNow > mins){
    mins += (24 * 60)
    hoursToGo = (mins - minsNow)/60;
  } else {
    hoursToGo = (mins - minsNow)/60;
  }
  var timeLeft = document.getElementById("hours-to-go");
  timeLeft.textContent = hoursToGo.toFixed(2) + " hours to go until the next sunrise";
}

var createMap = function(){
  var container = document.getElementById("map");
  var center = { lat: 52.740674, lng: -2.2187500 };
  var zoom = 6;
  mainMap = new MapWrapper(container, center, zoom);
  // geolocation
  mainMap.userLocation();
  // search box
  mainMap.createSearchBox();
  setTimeout(function(){
    getLatLong();
  }, 4000);
};

var app = function(){
  window.scrollTo(0, 0);
  createMap();
  var url = "/places";
  makeRequest(url, requestCompleteFav);
  var googlemap = document.getElementById("pac-input");
  googlemap.addEventListener('keydown', function(e){
    if(e.keyCode == 13){
      getLatLong();
    }
  });
};
window.addEventListener('load', app);
