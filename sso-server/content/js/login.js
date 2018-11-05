var MAP = {
    "DEV": {
        URL_LOGIN_PAGE: "http://z.dev.cnki.net:8040",
    },
    "TEST": {
        URL_LOGIN_PAGE: "http://ztest.cnki.net:8040",
    },
    "PROD": {
        URL_LOGIN_PAGE: "http://z.cnki.net:8040",
    },
};
var iframe = document.createElement("iframe");
var query = JSON.stringify(Object.assign({
    origin: location.origin,
}, window.__APP__));
iframe.style.display = "none";
document.body.appendChild(iframe);
iframe.addEventListener("load", function () {
    ready();
})
iframe.src = `${MAP[window.__APP__.MODE].URL_LOGIN_PAGE}/login.html?${query}`;

function preAjax(options) {
    return new Promise((resolve, reject) => {
        var fn = function ({ data }) {
            if (data.url === options.url) {
                if (data.status === "resolved") {
                    resolve(data.result);
                } else if (data.status === "rejected") {
                    reject(data.message);
                }
            }
        };
        window.addEventListener("message", fn);
        iframe.contentWindow.postMessage({ type: "ajax", detail: { ...options, }, }, MAP[window.__APP__.MODE].URL_LOGIN_PAGE);
    });
}

function ready() {
    preAjax({
        url: "/ip"
    })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });

    preAjax({
        url: "/add",
        method:"POST",
    })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });


    // var p1=preAjax({
    //     url: "/ip"
    // });
    // var p2=preAjax({
    //     url: "/add",
    //     method: "POST",
    // });


    // Promise.all([p1,p2])
    //     .then(res => {
    //         console.log(res)
    //     })
    //     .catch(err=>{
    //         console.log(err)
    //     });

}

