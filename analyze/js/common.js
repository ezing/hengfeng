 function getParam(name, url) {
     var r = new RegExp('(\\?|#|&)' + name + '=(.*?)(#|&|$)');
     var m = (url || location.href).match(r);
     return (m ? m[2] : '');
 }

 function formateNum(num) {
     return parseFloat(num).toFixed(2);
 }
