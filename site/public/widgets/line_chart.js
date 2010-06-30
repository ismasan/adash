google.load("visualization", "1", {packages:["corechart"]});

Widgets.LineChartWidget = (function(){
  var server, 
      chart,
      container,
      self,
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
      
  var klass = function(event_stream, container_element){
    server    = event_stream;
    container = container_element;
    self = this;
    
    window.setInterval(function(){
      current_interval++;
    },5000);
    
    server.bind('all', function(evt, evt_name, data){        
      self.update(evt_name, data)
    });
  };
  
  klass.prototype = {
    update: function(event_name, event_data){
      addEvent(event_name, event_data);
      updateChart();
    }
  };
  return klass;
})();