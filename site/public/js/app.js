StubEventStream = (function(){
  
  var interval, 
      running = false, 
      counter = 0,
      interval_seconds = 2;
  
  var Stubs = {
    lats: [51.5276013, 51.4256013, 51.5356013, 51.525609, 51.5256011, 51.525600, 51.5244011, 51.5956011, 51.5258011, 51.5256022],
    longs: [-0.1099465, -0.1099465, -0.1099465, -0.1099465, -0.1099465],
    lat: function(){var l = Stubs.lats.length-1; return Stubs.lats[Math.round(Math.random(l)*l)]},
    long: function(){var l = Stubs.longs.length-1; return Stubs.longs[Math.round(Math.random(l)*l)]},
    
    order: function(){
      var names = ['order_placed', 'order_cancelled', 'order_shipped', 'order_closed'];
      var infos = ['2 products', '1 product', '5 products'];
      return {
        name: names[Math.round(Math.random(3)*3)],
        data: {
          info: infos[Math.round(Math.random(2)*2)],
          total: Math.random(10)*100,
          latitude: Stubs.lat(),
          longitude: Stubs.long()
        }
      };
    },
    contact: function(){
      var infos = ['John Doe', 'Jean Doe', 'Ismael Celis', 'Makoto Inoue', 'Mark Evans', 'Max Williams'];
      return {
        name: 'contact_received',
        data: {
          info: infos[Math.round(Math.random(2)*2)],
          latitude: Stubs.lat(),
          longitude: Stubs.long()
        }
      };
    }
  };
  
  // 51.5256013 -0.109946
      
  function randomEvent(){
    var type = ['order','order','order','order','order','order', 'contact'][Math.round(Math.random(6))]
    return Stubs[type]();
  }
  
  var self;
  
  var klass = function(){
    self = this;
  };
  
  klass.prototype = {
    stop: function(){
      window.clearInterval(interval);
      running = false;
    },

    play: function(){
      interval = window.setInterval(
        function(){
          var e = randomEvent();
          $(self).trigger(e.name, [e.name, e.data]);
          $(self).trigger('all', [e.name, e.data]);
          counter++;
        },
        interval_seconds * 1000
      );
      running = true;
    },
    
    isRunning: function(){
      return running;
    },
    
    bind: function(evt_name, handler){
      $(self).bind(evt_name, handler);
    }
  };
  
  return klass;
})();