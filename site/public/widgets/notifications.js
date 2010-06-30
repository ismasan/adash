Widgets.NotificationsWidget = (function(){
  
  var server, container;
  
  function showNotification(title, body){
     if (window.webkitNotifications.checkPermission() == 0) {
       // note the show()
       window.webkitNotifications.createNotification('', title, body).show(); 
     } else {
       alert('You have to click on "Set notification permissions for this page" first to be able to receive notifications.');
     }
  }
  
  function update(evt, event_name, data){
    showNotification(event_name, data.info + ' - $' + data.total)
  };
  
  var klass = function(event_stream, container_element){
    window.webkitNotifications.requestPermission();
    console.log(window.webkitNotifications.checkPermission())
    server = event_stream;
    
    server.bind('contact_received', update);
    server.bind('order_closed', update);
  };
  
  klass.prototype = {
    
  };
  
  return klass;
})();