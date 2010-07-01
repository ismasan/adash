var sys = require("sys");
var ws = require('./lib/node-websocket-server/lib/ws');
var now = require('./lib/utils').Utils.now;


/*-----------------------------------------------
  logging:
-----------------------------------------------*/
function log(msg) {
  sys.puts(msg.toString());
};

/*-----------------------------------------------
  Format message:
-----------------------------------------------*/
function jsonMessage(event_name, data){
  data['event_date'] = now();
  return JSON.stringify({
    event: event_name,
    data: data
  });
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
  
  var msg = jsonMessage('user_connected', {
    info: conn._id
  });
  
  server.send(msg);
  server.broadcast(msg);
  
  // Just echo whatever is sent.
  conn.addListener("message", function(message){
    log("<"+conn._id+"> "+message);
    server.broadcast(message);
  });
});

server.addListener("close", function(conn){
  log("closed connection: "+conn._id);
  server.broadcast(jsonMessage('user_disconnected', {info: conn._id}));
});

// Handle HTTP Requests:
server.addListener("request", function(req, res){
  req.addListener('data', function(data){
    server.broadcast('[http] '+ data)
  });
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Message aknowledged\n');
});


function MockEvents(seconds){
  var stubs = require('./lib/mock_events');
  stream = new stubs.StubEventStream(function(e){
    server.broadcast(JSON.stringify(e))
  }, seconds).play();
};

/*-----------------------------------------------
  Server:
-----------------------------------------------*/
MockEvents(3);// mock events every x seconds
server.listen(8000, "ismasan.local");
