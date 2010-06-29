Widgets.ActivityWidget = (function(){
  
  var server, container;
  
  var $template = $('<ul class="list events"></ul>');
  
  var klass = function(socket_server, container_element){
    server = socket_server;
    container = $('#'+container_element);
    
    container.append($template);
  };
  
  klass.prototype = {
    update: function(event_name, data){
      var line = '<li class="">';
          line  += '<h4>' + event_name + '</h4>';
          line  += data;
          line += '</li>';
      line = $(line);
      line.hide().prependTo($template).slideDown('slow');
    }
  };
  
  return klass;
})();