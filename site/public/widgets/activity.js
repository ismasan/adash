Widgets.ActivityWidget = (function(){
  
  var server, container, self;
  
  var $template = $('<ul class="list events"></ul>');
  
  var klass = function(event_stream, container_element){
    server = event_stream;
    container = $('#'+container_element);
    self = this;
    container.append($template);
    // Bind to server events
    server.bind('all', function(evt, evt_name, data){        
      self.update(evt_name, data)
    });
  };
  
  klass.prototype = {
    update: function(event_name, data){
      var line = '<li class="'+event_name+'">';
          line  += '<h4>' + event_name + '</h4>';
          line  += data.info;
          line += '</li>';
      line = $(line);
      line.hide().prependTo($template).slideDown('slow');
      $template.find("li:gt(7)").remove(); // truncate list
    }
  };
  
  return klass;
})();