Widgets.ActivityWidget = (function(){
  
  var server, container;
  
  var $template = $('<ul class="list events"></ul>');
  
  function update(evt, event_name, data){
    var line = '<li class="'+event_name+'">';
        line  += '<h4>' + event_name + '</h4>';
        line  += (data.event_date + ' - ' + data.info);
        line += '</li>';
    line = $(line);
    line.hide().prependTo($template).slideDown('slow');
    $template.find("li:gt(10)").remove(); // truncate list
  }
  
  var klass = function(event_stream, container_element){
    server = event_stream;
    container = $('#'+container_element);
    container.append($template);
    // Bind to server events
    server.bind_all(update);
  };
  
  return klass;
})();