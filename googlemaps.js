var map;
var infowindow;

function initialize() {
	var markers = [];
	var mapOptions = {
		zoom: 15
	};
	map = new google.maps.Map(document.getElementById('map-canvas'),
		mapOptions);

	var pos = new google.maps.LatLng(43.669713, -79.387435);

	map.setCenter(pos);

	// Create the search box and link it to the UI element.
	var input = (document.getElementById('pac-input'));
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var searchBox = new google.maps.places.SearchBox((input));

	// Listen for the event fired when the user selects an item from the
  	// pick list. Retrieve the matching places for that item.
  	google.maps.event.addListener(searchBox, 'places_changed', function() {
  		var places = searchBox.getPlaces();

  		if (places.length == 0) {
  			return;
  		}
  		for (var i = 0, marker; marker = markers[i]; i++) {
  			marker.setMap(null);
  		}

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
    	var image = {
    		url: place.icon,
    		size: new google.maps.Size(71, 71),
    		origin: new google.maps.Point(0, 0),
    		anchor: new google.maps.Point(17, 34),
    		scaledSize: new google.maps.Size(25, 25)
    	};

      // Create a marker for each place.
      var marker = new google.maps.Marker({
      	map: map,
      	icon: image,
      	title: place.name,
      	position: place.geometry.location
      });

      markers.push(marker);

      bounds.extend(place.geometry.location);

      var request = {
      	location: place.geometry.location || pos,
      	radius: 200,
      	types: ['parking']
      };

      infowindow = new google.maps.InfoWindow();
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, callback);
  }

  google.maps.event.addListener(map, 'zoom_changed', function() {
  	zoomChangeBoundsListener = 	google.maps.event.addListener(map, 'bounds_changed', function(event) {
  		if (this.getZoom() > 15 && this.initialZoom == true) {
                // Change max/min zoom here
                this.setZoom(15);
                this.initialZoom = false;
            }
            google.maps.event.removeListener(zoomChangeBoundsListener);
        });
  });

  map.initialZoom = true;
  map.fitBounds(bounds);
});

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
  	var bounds = map.getBounds();
  	searchBox.setBounds(bounds);
  });
}

function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		for (var i = 0; i < results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}

google.maps.event.addDomListener(window, 'load', initialize);