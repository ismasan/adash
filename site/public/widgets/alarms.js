Widgets.AlarmsWidget = (function(){
  
  var server, container;
  
  var $audio = $('<audio src="/happy.mp3" id="order_alarm" preload="auto">No sound supported</audio>');
  
  function loadAndPlay(audio_id){
    var sound = document.getElementById(audio_id);
    sound.load();
    sound.play();
  }
  
  
  var klass = function(event_stream, container_element){
    server = event_stream;
    container = $('body');
    container.append($audio);
    // Bind to server events
    server.bind('order_closed', function(){loadAndPlay('order_alarm')});
  };
  
  return klass;
})();