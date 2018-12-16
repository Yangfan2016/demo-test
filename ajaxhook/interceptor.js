; (function () {
    let cacheXHR = XMLHttpRequest;
    window.cacheXHR = cacheXHR;

    window.xAajax = function (proxyHook) {
        XMLHttpRequest = function () {
            let xhr = new cacheXHR();

            for (attr in xhr) {
                let val = xhr[attr];
                if (typeof val === "function") {
                    this[attr] = function () {
                        val.apply(xhr, [...arguments]);
                    };
                } else {
                    Object.defineProperty(this, attr, {
                        set(v) {
                            if (typeof proxyHook[attr]==="function") {
                                xhr[attr]=function () {
                                    proxyHook[attr](xhr);
                                };
                            } else {
                                xhr[attr]=v;
                            }
                        },
                        get() {
                            return xhr[attr];
                        }
                    });
                }
            }
        };
    }

}());
