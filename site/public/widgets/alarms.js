Widgets.AlarmsWidget = (function(){
  
  var server, container;
  
  var audio =  '<audio src="/audio/order.mp3" id="order_alarm" preload="auto">No sound</audio>';
      audio += '<audio src="/audio/message.mp3" id="message_alarm" preload="auto">No sound</audio>';
      audio += '<audio src="/audio/connection.mp3" id="connection_alarm" preload="auto">No sound</audio>';
  
  function loadAndPlay(audio_id){
    var sound = document.getElementById(audio_id);
    sound.load();
    sound.play();
  }
  
  
  var klass = function(event_stream, container_element){
    server = event_stream;
    container = $('body');
    container.append(audio);
    // Bind to server events
    server.bind('order_closed', function(){loadAndPlay('order_alarm')});
    server.bind('chat_message', function(){loadAndPlay('message_alarm')});
    server.bind('user_connected', function(){loadAndPlay('connection_alarm')});
  };
  
  return klass;
})();