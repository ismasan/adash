Widgets.ControlsWidget = (function(){
  
  var server, container, interval, running = false, counter = 0, $button;
  
  var klass = function(event_stream, container_element){
    server = event_stream;
    container = $('#'+container_element);
    $button = container.find('#play');
    $status = container.find('.status');
    
    $button.bind('click', function(){
      if(server.isRunning()) server.stop();
      else server.play();
    });
    
    server.bind('open', function(data){
      $status.addClass('running').html('Running');
    });
    
    server.bind('close', function(data){
      $status.removeClass('running').html('Stopped');
    });
  };
  
  klass.prototype = {
    
  };
  
  return klass;
})();