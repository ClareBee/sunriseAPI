
var MapWrapper = function(container, coords, zoom){
  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: zoom
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
  var locate = place.geometry.location;
  newMarker.infowindow = new google.maps.InfoWindow({
    content: "Your new location"
  });
  newMarker.infowindow.open(this.googleMap, newMarker);
  this.markers.push(newMarker);
  this.showCoords(newMarker);
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
    console.log(marker + "hi");
  }.bind(this));

};

module.exports = MapWrapper;
