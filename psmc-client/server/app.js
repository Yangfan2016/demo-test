const express=require("express");
const path=require("path");
const app=express();


const PORT=81;

app.use("/static",express.static(path.resolve(__dirname,"../content")));

app.get("/",function (req,res){
    res.sendFile(path.resolve(__dirname,"../views/index.html"));
});

app.listen(PORT);
console.log(`http://x.dev.cnki.net:${PORT}`);

