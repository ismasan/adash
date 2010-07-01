exports.Utils = {
  now: function(){
    var D = new Date(),
        y = D.getFullYear(),
        m = D.getMonth(),
        d = D.getDate(),
        h = D.getHours(),
        mins = D.getMinutes();
    return y+'/'+m+'/'+d+' '+h+':'+mins;
  }
};