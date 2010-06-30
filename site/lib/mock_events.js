var sys    = require("sys");
exports.StubEventStream = (function(){
  
  var interval, 
      running = false, 
      counter = 0,
      interval_seconds = 2;
  
  var Stubs = {
    lats: [51.5276013, 51.4256013, 51.5356013, 51.525609, 51.5256011, 51.525600, 51.5244011, 51.5956011, 51.5258011, 51.5256022],
    longs: [-0.1099465, -0.1099465, -0.1099465, -0.1099465, -0.1099465],
    lat: function(){var l = Stubs.lats.length-1; return Stubs.lats[Math.round(Math.random(l)*l)]},
    long: function(){var l = Stubs.longs.length-1; return Stubs.longs[Math.round(Math.random(l)*l)]},
    
    now: function(){
      var D = new Date(),
          y = D.getFullYear(),
          m = D.getMonth(),
          d = D.getDate(),
          h = D.getHours(),
          m = D.getMinutes();
      return y+'/'+m+'/'+d+' '+h+':'+m;
    },
    
    order: function(){
      var names = ['order_placed', 'order_cancelled', 'order_shipped', 'order_closed'];
      var infos = ['2 products', '1 product', '5 products'];
      return {
        name: names[Math.round(Math.random(3)*3)],
        data: {
          event_date: Stubs.now(),
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
          event_date: Stubs.now(),
          info: infos[Math.round(Math.random(5)*5)],
          latitude: Stubs.lat(),
          longitude: Stubs.long()
        }
      };
    },
    messages: [
      "Hey mum!",
      "Anybody here?",
      "Wow we're making loads of money!",
      "This is a random message",
      "I don't have any friends :(",
      "This relevant message sent from my iPhone"
    ],
    chat: function(){
      var infos = ['John Doe', 'Jean Doe', 'Ismael Celis', 'Makoto Inoue', 'Mark Evans', 'Max Williams'];
      
      return {
        name: 'chat_message',
        data: {
          event_date: Stubs.now(),
          info: infos[Math.round(Math.random(5)*5)],
          message: Stubs.messages[Math.round(Math.random(5)*5)]
        }
      };
    }
  }
  
  // 51.5256013 -0.109946
      
  function randomEvent(){
    var type = ['order','contact','order','order', 'contact', 'order', 'chat', 'order'][Math.round(Math.random(7))]
    return Stubs[type]();
  }
  
  var self, callback;
  
  var klass = function(a_callback){
    callback = a_callback;
    self = this;
    sys.puts(this)
  };
  
  klass.prototype = {
    stop: function(){
      clearInterval(interval);
      running = false;
    },

    play: function(){
      sys.puts('Bradcasting mock messages')
      interval = setInterval(
        function(){
          callback(randomEvent())
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
    },
    
    bind_all: function(handler){
      this.bind('all', handler)
    }
  };
  
  return klass;
})();