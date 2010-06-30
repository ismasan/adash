Widgets.ControlsWidget = (function(){
  
  var server, container, interval, running = false, counter = 0;
  
  var $button = $('<input id="play" type="button" value="Start/stop" />');
  
  var klass = function(event_stream, container_element){
    server = event_stream;
    container = $('#'+container_element);
    
    $button.appendTo(container).bind('click', function(){
      if(server.isRunning()) server.stop();
      else server.play();
    });
  };
  
  klass.prototype = {
    
  };
  
  return klass;
})();