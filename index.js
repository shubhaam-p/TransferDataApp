const express = require('express');
const {callDownloadImg, writeData} = require('./functions');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('node:fs');

const app = express();
app.use(express.json());
app.use(cors());

// Proxy setup
app.use('/api', createProxyMiddleware({
    target: 'http://192.168.0.100:8080/', // Proxy requests to this server
    changeOrigin: true,
}));

//Storing data in txt file 
app.post('/storeFileNames',function(req, res){
    if(req.body.data.length>0)
        writeData(req.body.data)
    res.send("recieved image urls");
})

//Send the fileNames from txt file to download
app.get('/startDownload', function(req,res){
    fs.readFile('fileNames.txt', 'utf8', (err, data) => {
    if (err) {
        console.error("Error occurred",err);
    }else{
        arrayImg = data.split(',');
        callDownloadImg(arrayImg)
        res.send("started downloading")
    }
    });

})

app.get('/',function(req, res){
    res.sendFile(__dirname+"/index.html");
})

app.listen(3000, ()=>console.log("Server started"))