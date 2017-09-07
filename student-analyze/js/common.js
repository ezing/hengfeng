 function getParam(name, url) {
     var r = new RegExp('(\\?|#|&)' + name + '=(.*?)(#|&|$)');
     var m = (url || location.href).match(r);
     return (m ? m[2] : '');
 }

 function formateNum(num) {
     return parseFloat(num).toFixed(2);
 }

 function isJSON(str) {
     if (typeof(str) == 'object' && Object.prototype.toString.call(str).toLowerCase() == "[object object]") {
         return true;
     } else if (typeof(str) == 'string') {
         return true;
     } else {
         return false;
     }
 }

 function formateXAxis(params) {
     var newParamsName = ""; // 最终拼接成的字符串
     var paramsNameNumber = params.length; // 实际标签的个数
     var provideNumber = 5; // 每行能显示的字的个数
     var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
     /**
      * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
      */
     // 条件等同于rowNumber>1
     if (paramsNameNumber > provideNumber) {
         /** 循环每一行,p表示行 */
         for (var p = 0; p < rowNumber; p++) {
             var tempStr = ""; // 表示每一次截取的字符串
             var start = p * provideNumber; // 开始截取的位置
             var end = start + provideNumber; // 结束截取的位置
             // 此处特殊处理最后一行的索引值
             if (p == rowNumber - 1) {
                 // 最后一次不换行
                 tempStr = params.substring(start, paramsNameNumber);
             } else {
                 // 每一次拼接字符串并换行
                 tempStr = params.substring(start, end) + "\n";
             }
             newParamsName += tempStr; // 最终拼成的字符串
         }

     } else {
         // 将旧标签的值赋给新标签
         newParamsName = params;
     }
     //将最终的字符串返回
     return newParamsName
 }

 String.prototype.jstpl_format = function(ns) {
     function fn(w, g) {
         if (g in ns) {
             return ns[g];
         } else {
             return '';
         }
     };
     return this.replace(/%\(([A-Za-z0-9_|.]+)\)/g, fn);
 };
