var sys = require("sys");
var ws = require('./lib/node-websocket-server/lib/ws');


/*-----------------------------------------------
  logging:
-----------------------------------------------*/
 function log(msg) {
   sys.puts(msg.toString());
 };


/*-----------------------------------------------
  Spin up our server:
-----------------------------------------------*/
var server = ws.createServer({
  debug: true
});

server.addListener("listening", function(){
  log("Listening for connections.");
});

// Handle WebSocket Requests
server.addListener("connection", function(conn){
  log("opened connection: "+conn._id);
  
  server.send(conn._id, "Connected as: "+conn._id);
  server.broadcast("["+conn._id+"] connected");
  
  conn.addListener("message", function(message){
    log("<"+conn._id+"> "+message);
    server.broadcast("["+conn._id+"] "+message);
  });
});

server.addListener("close", function(conn){
  log("closed connection: "+conn._id);
  server.broadcast("["+conn._id+"] disconnected");
});

// Handle HTTP Requests:
server.addListener("request", function(req, res){
  req.addListener('data', function(data){
    server.broadcast('[http] '+ data)
  });
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Message aknowledged\n');
});

// server.addListener("shutdown", function(conn){
//   // never actually happens, because I never tell the server to shutdown.
//   log("Server shutdown");
// });


/*-----------------------------------------------
  Server:
-----------------------------------------------*/





server.listen(8000, "ismasan.local");
