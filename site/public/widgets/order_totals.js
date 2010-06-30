Widgets.OrderTotalsWidget = (function(){
  
  var server, container, self, placed_sum = 0, closed_sum = 0, $closed_amount, $placed_amount;
  
  var $template = $('<ul class="list events"></ul>');
  
  function updateClosed(total){
    closed_sum += total;
    $closed_amount.html(closed_sum.toFixed(2))
  };
  
  function updatePlaced(total){
    placed_sum += total;
    $placed_amount.html(placed_sum.toFixed(2))
  };
  
  var klass = function(event_stream, container_element){
    server = event_stream;
    container = $('#'+container_element);
    self = this;
    $closed_amount = container.find('.closed_amount');
    $placed_amount = container.find('.placed_amount');
    // Bind to server events
    server.bind('order_closed', function(evt, evt_name, data){        
      updateClosed(data.total)
    });
    server.bind('order_placed', function(evt, evt_name, data){       
      updatePlaced(data.total)
    });
  };
  
  return klass;
})();