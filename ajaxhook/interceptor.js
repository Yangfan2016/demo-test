;(function() {
  let cacheXHR = XMLHttpRequest;
  window.cacheXHR = cacheXHR;

  window.xAjax = function(proxyHook) {
    XMLHttpRequest = function() {
      let xhr = new cacheXHR();
      var self = this;
      for (let attr in xhr) {
        let val = xhr[attr];
        if (typeof val === "function") {
          this[attr] = function() {
            val.apply(xhr, [...arguments]);
          };
        } else {
          Object.defineProperty(this, attr, {
            set(v) {
              if (typeof v === "function") {
                xhr[attr] = function() {
                  if (
                    typeof proxyHook[attr] === "function" &&
                    proxyHook[attr](xhr)
                  )
                    return;
                  v.apply(xhr, [...arguments]);
                };
              } else {
                xhr[attr] = v;
              }
            },
            get() {
              return xhr[attr];
            }
          });
        }
      }
    };
  };
})();
