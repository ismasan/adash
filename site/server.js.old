var sys = require("sys"),
  ws = require("./lib/ws"),
  p = sys.puts;

// CHANNEL ::::::::::::::::::::::::::::::::
var Channel = function(){
  var clients = [];
  
  this.add = function(ws){
    clients.push(ws);
    p('NUM CLIENTES: ' + clients.length)
  };
  
  this.remove = function(ws){
    var c = [];
    for(var i=0,t=clients.length;i<t;i++){
      if(clients[i] != ws) c.push(clients[i])
    }
    clients = c;
  };
  
  this.write = function(event_name, data){
    try{
      for(var i=0,t=clients.length;i<t;i++){
        clients[i].write(data)
      }
    }catch(e){
      p(e)
    }
    
  }
};

// CHANNEL INSTANCE ::::::::::::::::::::::::
var channel = new Channel();

// SERVER ::::::::::::::::::::::::::::::::::
ws.createServer(function (websocket) {
  websocket.addListener("connect", function (resource) { 
    sys.debug("connect: " + resource);
    channel.add(websocket);
    
  }).addListener("data", function (data) { 
    sys.debug(data);
    channel.write(data);
    
  }).addListener("close", function () { 
    channel.remove(websocket)
    sys.debug("close");
  });
}).listen(8080);

p('WebSockets server launched on localhost:8080')