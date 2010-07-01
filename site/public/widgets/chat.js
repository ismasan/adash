Widgets.ChatWidget = (function(){
  
  var server, container, list;
  
  function update(data){
    list.prepend('<li><strong>'+data.info+':</strong> <span>'+data.message+'</span></li>');
  };
  
  function addInputs(){
    var form = $('<form id="chat_form"><input type="text" name="user" placeholder="User name" /><input type="text" name="message" placeholder="message" /></form>');
    container.append(form);
    form.submit(function(){
      server.send('chat_message', {
        event_date: Utils.now(),
        info: form.find('input[name=user]').val(),
        message: form.find('input[name=message]').val()
      });
      form.find('input[name=message]').val('').focus();
      return false;
    })
  };
  
  var klass = function(event_stream, container_element){
    server = event_stream;
    container = $('#'+container_element);
    list = container.find('ul.messages');
    addInputs();
    server.bind('chat_message', update);
  };
  
  klass.prototype = {
    
  };
  
  return klass;
})();