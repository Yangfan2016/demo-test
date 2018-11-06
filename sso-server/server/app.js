const express = require("express");
const path = require("path");
const app = express();

const PORT = 8040;

app.use("/static", express.static(path.resolve(__dirname, "../content")));

app.get("/login.html", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../views/login.html"));
});

app.get("/ip", function (req, res) {
    console.log(req.query);
    res.status(200);
    res.send({
        ip:"192.168.x.x",
    });
    res.end();
});

app.post("/add", function (req, res) {
    let body="";
    req.on("data",function (chunk) {
        body+=chunk;
    });
    req.on("end",function () {
        console.log(body);
    })
    res.status(200);
    res.send({
        success:true,
    });
    res.end();
});

// iframe + form + postmessage
app.get("/ip2", function (req, res) {
    console.log(req.query);
    res.status(200);
    res.send(`
    <script>
    ;top.postMessage({
        ip:"192.168.x.x",
    },"${req.headers.referer}");
    </script>
    `);
    res.end();
});

app.post("/add2", function (req, res) {
    let body="";
    req.on("data",function (chunk) {
        body+=chunk;
    });
    req.on("end",function () {
        console.log(body);
    })
    res.status(200);
    res.send(`
    <script>
    ;top.postMessage({
        ip:"101.168.x.x",
    },"${req.headers.referer}");
    </script>
    `);
    res.end();
});

app.listen(PORT);
console.log(`http://x.c.n:${PORT}`);

