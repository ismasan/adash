google.load("visualization", "1", {packages:["corechart"]});

Widgets.LineChartWidget = (function(){
  var server, 
      chart,
      container,
      counts = {},
      events = [],
      current_interval = 0,
      addEvent = function(event_name, event_data){
        var current_key = current_interval + 'x';
        if(counts[current_key] == null){
          counts[current_key] = {};
          events.push(event_name);
        }
        if(counts[current_key][event_name] == null)
          counts[current_key][event_name] = 0
        counts[current_key][event_name]++;
      },
      updateChart = function(){
        var chart     = new google.visualization.LineChart(document.getElementById(container));
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'x');
        $.each(events, function(i, e){
          data.addColumn('number', e);
        });
        for(time in counts){
          var p = [time];
          $.each(events, function(i, e){
            p.push(counts[time][e]);
          });
          data.addRow(p);
        }
        chart.draw(data, {curveType: "function",
          width: 400, height: 200,
          vAxis: {maxValue: 10}}
        );
      };
      
  var klass = function(socket_server, container_element){
    server    = socket_server;
    container = container_element;
    
    window.setInterval(function(){
      current_interval++;
    },5000);
    // chart     = new google.visualization.LineChart(document.getElementById(container));
  };
  
  klass.prototype = {
    update: function(event_name, event_data){
      addEvent(event_name, event_data);
      updateChart();
    }
  };
  return klass;
})();