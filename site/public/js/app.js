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