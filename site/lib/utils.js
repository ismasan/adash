exports.Utils = {
  now: function(){
    var D = new Date(),
        y = D.getFullYear(),
        m = D.getMonth(),
        d = D.getDate(),
        h = D.getHours(),
        m = D.getMinutes();
    return y+'/'+m+'/'+d+' '+h+':'+m;
  }
};