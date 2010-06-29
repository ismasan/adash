Widgets.LocationWidget = (function(){
  
  var server, container;
  var MAP;
  var USERS = {};
  
  var buildMap = function(lat, longi, callback){
    var callback = callback || function(map){};
    // if (!GBrowserIsCompatible()) return false;
    var maps_div = document.getElementById(container);
    MAP = new GMap2(maps_div);
    MAP.setCenter(new GLatLng(lat, longi), 13);
    MAP.setUIToDefault();
    //map.setMapType(G_HYBRID_MAP);
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
        addMarker(position.coords.latitude, position.coords.longitude, 'Ismael');
      });
      return false;
    }
  };

  function addMarker(lat, lon, label){
    var point = new GLatLng(lat,lon),
        marker = new GMarker(point);
    GEvent.addListener(marker, "click", function() {
      marker.openInfoWindowHtml(label);
    });
    setTimeout(function(){
      marker.openInfoWindowHtml(label);
    },500);
    MAP.setCenter(point, 13);
    MAP.addOverlay(marker);
  }
  
  var klass = function(socket_server, container_element){
    server = socket_server;
    container = container_element;
    
    findLoc();
  };
  
  klass.prototype = {
    update: function(event_name, data){
      addMarker(data.latitude, data.longitude, event_name);
    }
  };
  
  return klass;
})();