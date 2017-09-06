window.debug = true;

// 公共库
;
(function() {

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

    var M = M || {};

    M.util = {

        log: function(msg) {
            if (!!console && typeof console.log == 'function') {
                if (typeof msg == 'object') {
                    console.log(JSON.stringify(msg));
                } else {
                    console.log(msg);
                }
            }
        },

        isJSON: function(str) {
            if (typeof(str) == 'object' && Object.prototype.toString.call(str).toLowerCase() == "[object object]") {
                return true;
            } else if (typeof(str) == 'string') {
                return true;
            } else {
                return false;
            }
        },

        getParam: function(name, url) {
            var r = new RegExp('(\\?|#|&)' + name + '=(.*?)(#|&|$)');
            var m = (url || location.href).match(r);
            return (m ? m[2] : '');
        },

        // parseXmlToJson: function (res) {
        //     return JSON.parse($($($.parseXML(res)).find('string')).text());
        // }
    };

    window.M = M;

})();
