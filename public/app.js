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

var app = function(){
  var latitude = 36.7201600;
  var longitude = -4.4203400;
  var url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`;

  makeRequest(url, requestComplete);

}

window.addEventListener('load', app);
