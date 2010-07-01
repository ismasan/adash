var Utils = {
  now: function(){
    var D = new Date(),
        y = D.getFullYear(),
        m = D.getMonth(),
        d = D.getDate(),
        h = D.getHours(),
        mins = D.getMinutes();
    return y+'/'+m+'/'+d+' '+h+':'+mins;
  }
}

/* Ismael Celis 2010
Simplified WebSocket events dispatcher (no channels, no users)

var socket = new ServerEventsDispatcher('ws://some.host.com');

// bind to server events
socket.bind('some_event', function(data){
  alert(data.name + ' says: ' + data.message)
});

// broadcast events to all connected users
socket.trigger( 'some_event', {name: 'ismael', message : 'Hello world'} );
*/
var AbstractEventsDispatcher = function(){};
AbstractEventsDispatcher.prototype = {
  callbacks: {},
  global_callbacks: [],
  running: false,
  
  isRunning: function(){return this.running},
  
  bind: function(event_name, callback){
    this.callbacks[event_name] = this.callbacks[event_name] || [];
    this.callbacks[event_name].push(callback);
    return this;// chainable
  },
  
  bind_all: function(callback){
    this.global_callbacks.push(callback);
    return this;
  },
  
  dispatch: function(event_name, data){
    var chain = this.callbacks[event_name];
    if(typeof chain == 'undefined') return; // no callbacks for this event
    for(var i = 0; i < chain.length; i++){
      chain[i]( data )
    }
  },
  
  dispatch_global: function(event_name, data){
    for(var i = 0; i < this.global_callbacks.length; i++){
      this.global_callbacks[i]( event_name, data )
    }
  }
  
};

/* Wrap websocket connection
--------------------------------------------*/
var ServerEventsDispatcher = function(url){
  var conn, url = url, running = false, self = this;
  
  this.send = function(event_name, data){
    var payload = JSON.stringify({event:event_name, data: data});
    conn.send( payload ); // <= send JSON data to socket server
    return this;
  };
  
  this.stop = function(){
    conn.close();
    this.running = false;
  };
  
  this.play = function(){
    // Create websocket
    conn = new WebSocket(url);
    // dispatch to the right handlers
    conn.onmessage = function(evt){
      try{      
        var json = JSON.parse(evt.data);
        self.dispatch(json.event, json.data);
        self.dispatch_global(json.event, json.data);
      }catch(e){
        console.log("ERROR: "+e + ' ' + evt.data)
      }
    };

    conn.onclose  = function(){self.dispatch('close',null)}
    conn.onopen   = function(){self.dispatch('open',null)}
    this.running = true;
  };
  
  this.play();
};
ServerEventsDispatcher.prototype = new AbstractEventsDispatcher;

/* Periodically send out random events 
--------------------------------------------*/
var StubEventsDispatcher = function(){
  
  this.send = function(event_name, data){
    this.dispatch(event_name, data);
    this.dispatch_global(event_name, data);
    return this;
  };
  
  var self = this, interval;
  
  this.play = function(){
    this.running = true;
    interval = setInterval(randomEvent, 2000);
    this.send('open', {info:'server running', event_date:Utils.now()});
  };
  
  this.stop = function(){
    this.running = false;
    clearInterval(interval);
    this.send('close', {info:'server stopped', event_date:Utils.now()});
  };
  
  function randomEvent(){
    self.send('order_closed', {
      info: 'Mock order, 3 products',
      total: 100,
      event_date: Utils.now()
    });
  }
  
  this.play();
};
StubEventsDispatcher.prototype = new AbstractEventsDispatcher;