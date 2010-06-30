google.load("maps","3", {"other_params":"sensor=true"});
Widgets.LocationWidget = (function(){
  
  var server, container, bounds, self;
  // var MAP;
  var USERS = {};
  
  var buildMap = function(lat, longi, callback){
    var callback = callback || function(map){};
    var maps_div = document.getElementById(container);
    var options = {
      zoom: 11, 
      center: new google.maps.LatLng(lat, longi),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    
    MAP = new google.maps.Map(maps_div, options);
    callback(MAP);
  };


  function findLoc(){
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
    // Adjust map to the left after 4 seconds
    // window.clearTimeout(pan_interval);
    //     pan_interval = window.setTimeout(function(){
    //       MAP.panBy(300, 0);
    //     }, 4000);
  }
  
  var klass = function(event_stream, container_element){
    server = event_stream;
    container = container_element;
    self = this;
    bounds = new google.maps.LatLngBounds();
    findLoc();
    
    server.bind('order_placed order_shipped contact_received', function(evt, evt_name, data){        
      self.update(evt_name, data)
    });
  };
  
  klass.prototype = {
    update: function(event_name, data){
      addMarker(data.latitude, data.longitude, event_name + '<br />' + data.info);
    }
  };
  
  return klass;
})();