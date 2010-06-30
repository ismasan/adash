var Utils = {
  now: function(){
    var D = new Date(),
        y = D.getFullYear(),
        m = D.getMonth(),
        d = D.getDate(),
        h = D.getHours(),
        m = D.getMinutes();
    return y+'/'+m+'/'+d+' '+h+':'+m;
  }
}

var StubEventStream = (function(){
  
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
          event_date: Utils.now(),
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
          event_date: Utils.now(),
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
          event_date: Utils.now(),
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
    },
    
    bind_all: function(handler){
      this.bind('all', handler)
    }
  };
  
  return klass;
})();









/* Ismael Celis 2010
Simplified WebSocket events dispatcher (no channels, no users)

var socket = new ServerEventsDispatcher();

// bind to server events
socket.bind('some_event', function(data){
  alert(data.name + ' says: ' + data.message)
});

// broadcast events to all connected users
socket.trigger( 'some_event', {name: 'ismael', message : 'Hello world'} );
*/

var ServerEventsDispatcher = function(url){
  var conn, url = url, running = false;
  
  var callbacks = {};
  var global_callbacks = [];
  
  this.bind = function(event_name, callback){
    callbacks[event_name] = callbacks[event_name] || [];
    callbacks[event_name].push(callback);
    return this;// chainable
  };
  
  this.bind_all = function(callback){
    global_callbacks.push(callback);
    return this;
  };
  
  this.trigger = function(event_name, data){
    var payload = JSON.stringify({event:event_name, data: data});
    conn.send( payload ); // <= send JSON data to socket server
    return this;
  };
  
  this.stop = function(){
    conn.close();
    running = false;
  };
  
  this.play = function(){
    conn = new WebSocket(url);
    // dispatch to the right handlers
    conn.onmessage = function(evt){
      try{      
        var json = JSON.parse(evt.data);
        dispatch(json.event, json.data);
        dispatch_global(json.event, json.data);
      }catch(e){
        console.log("ERROR: "+e + ' ' + evt.data)
      }
    };

    conn.onclose = function(){dispatch('close',null)}
    conn.onopen = function(){dispatch('open',null)}
    running = true;
  };
  
  this.isRunning = function(){
    return running;
  };
  
  this.play();
  
  var dispatch = function(event_name, data){
    var chain = callbacks[event_name];
    if(typeof chain == 'undefined') return; // no callbacks for this event
    for(var i = 0; i < chain.length; i++){
      chain[i]( data )
    }
  }
  
  var dispatch_global = function(event_name, data){
    for(var i = 0; i < global_callbacks.length; i++){
      global_callbacks[i]( event_name, data )
    }
  }
};