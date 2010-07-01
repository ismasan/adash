google.load("visualization", "1", {packages:["corechart"]});

Widgets.PieChartWidget = (function(){
  var server, 
      chart,
      container,
      counts = {},
      event_types = [];
      addEvent = function(event_name, event_data){
        if(!counts[event_name]){
          counts[event_name] = 0;
          event_types.push(event_name)
        }
        counts[event_name]++;
      },
      updateChart = function(){
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Status');
        data.addColumn('number', 'Quantity');
        data.addRows(event_types.length);
        $.each(event_types, function(i,e){
          data.setValue(i, 0, e);
          data.setValue(i, 1, counts[e]);
        });
        
        var chart = new google.visualization.PieChart(document.getElementById(container));
        chart.draw(data, {width: 400, height: 200, title: 'Orders by status', backgroundColor:'#333333',titleColor:'#ffffff',legendTextColor:'#ffffff'});
      };
  
  function update(event_name, event_data){
    addEvent(event_name, event_data);
    updateChart();
  }
        
  var klass = function(event_stream, container_element){
    server    = event_stream;
    container = container_element;
    console.log(container);
    // server.bind_all(update);
    $.each(['order_placed', 'order_cancelled', 'order_shipped', 'order_closed'], function(i,e){
      server.bind(e, function(data){
        update(e,data);
      })
    })
  };
  return klass;
})();