var sys    = require("sys");
var now = require('./utils').Utils.now;

exports.StubEventStream = (function(){
  
  var interval, 
      running = false, 
      counter = 0,
      interval_seconds;
  
  var Stubs = {
    lats: [51.5276013, 51.4256013, 51.5356013, 51.525609, 51.5256011, 51.525600, 51.5244011, 51.5956011, 51.5258011, 51.5256022],
    longs: [-0.1099465, -0.1099465, -0.1099465, -0.1099465, -0.1099465],
    lat: function(){var l = Stubs.lats.length-1; return Stubs.lats[Math.round(Math.random(l)*l)]},
    long: function(){var l = Stubs.longs.length-1; return Stubs.longs[Math.round(Math.random(l)*l)]},
    
    index: function(size){return Math.round(Math.random(size)*size)},
    
    order: function(){
      var names = ['order_placed', 'order_cancelled', 'order_shipped', 'order_closed'];
      var infos = ['2 products', '1 product', '5 products'];
      return {
        event: names[Stubs.index(3)],
        data: {
          event_date: now(),
          info: infos[Stubs.index(2)],
          total: Math.random(10)*100,
          latitude: Stubs.lat(),
          longitude: Stubs.long()
        }
      };
    },
    contact: function(){
      var infos = ['John Doe', 'Jean Doe', 'Dr. Doolittle', 'Barack Obama', 'Corey88', 'Napoleon', 'Bruce Wayne'];
      return {
        event: 'contact_received',
        data: {
          event_date: now(),
          info: infos[Stubs.index(6)],
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
      "This relevant message sent from my iPhone",
      "What is this all about?!",
      "This chat box is way too small"
    ],
    chat: function(){
     var infos = ['John Doe', 'Jean Doe', 'Dr. Doolittle', 'Barack Obama', 'Corey88', 'Napoleon', 'Bruce Wayne'];
      
      return {
        event: 'chat_message',
        data: {
          event_date: now(),
          info: infos[Stubs.index(6)],
          message: Stubs.messages[Stubs.index(7)]
        }
      };
    }
  }
  
  // 51.5256013 -0.109946
      
  function randomEvent(){
    var type = ['chat','contact','order'][Stubs.index(2)]
    return Stubs[type]();
  }
  
  var self, callback;
  
  var klass = function(a_callback, seconds){
    callback = a_callback;
    interval_seconds = seconds || 2;
    self = this;
    sys.puts(this)
  };
  
  klass.prototype = {
    stop: function(){
      clearInterval(interval);
      running = false;
    },

    play: function(){
      sys.puts('Broadcasting mock messages')
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
    }
  };
  
  return klass;
})();