google.load("maps","3", {"other_params":"sensor=true"});
Widgets.LocationWidget = (function(){
  
  var server, container, bounds, max_markers = 10, all_markers = [];
  // var MAP;
  var USERS = {};
  
  var buildMap = function(lat, longi, callback){
    var callback = callback || function(map){};
    var maps_div = document.getElementById(container);
    var options = {
      zoom: 11, 
      center: new google.maps.LatLng(lat, longi),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      navigationControl: false,
      mapTypeControl: false
    }
    
    MAP = new google.maps.Map(maps_div, options);
    callback(MAP);
  };


  function initUserLocation(){
    if (!navigator.geolocation) {
      alert('Sorry, your browser does not support Geo Services');
    }
    else {
      // Get the current location    
      navigator.geolocation.getCurrentPosition(function(position){
        buildMap(position.coords.latitude, position.coords.longitude);
        addMarker(position.coords.latitude, position.coords.longitude, 'You are here');
      });
      return false;
    }
  };
  
  var pan_interval;
  var markers = {};
  
  function addMarker(lat, lon, label){
    var key = (lat + lon) + 'marker' + label,
        marker;
    if(markers[key])
      return markers[key]
    
    var point = new google.maps.LatLng(lat,lon);
    marker = new google.maps.Marker({
        position: point, 
        map: MAP,
        title:label
    });
    var infowindow = new google.maps.InfoWindow(
        { content: label, disableAutoPan:false,
          size: new google.maps.Size(50,50)
    });
    google.maps.event.addListener(marker, 'click', function() {
      $(document).trigger('info_open:location', [infowindow]);
      infowindow.open(MAP,marker);
    });
    setTimeout(function(){
      $(document).trigger('info_open:location', [infowindow]);
      infowindow.open(MAP,marker);
    },500);
    bounds.extend(point)
    MAP.fitBounds(bounds);
    // Close info when other info open
    $(document).bind('info_open:location', function(event, info){
      if(info != infowindow) infowindow.close();
    });
    markers[key] = marker;
    all_markers.push(marker);
    if(all_markers.length > max_markers){
      all_markers.shift().setMap(null) // delete marker;
      delete markers[key];
    }
  }
  
  function update(event_name, data){
    addMarker(data.latitude, data.longitude, event_name + '<br />' + data.info);
  }
  
  var klass = function(event_stream, container_element){
    server = event_stream;
    container = container_element;
    bounds = new google.maps.LatLngBounds();
    initUserLocation();
    
    $.each(['order_placed', 'order_shipped', 'contact_received'], function(i,e){
      server.bind(e, function(data){
        update(e,data);
      })
    })
    
  };
  
  return klass;
})();