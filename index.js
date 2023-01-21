const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const JSZip = require('jszip'); 
const mainpath = path.join(__dirname,"../YOUTUBE VIDEO DOWNLOADER");
const indexfile = fs.readFileSync("index.html","utf-8");

app.use(express.static(mainpath));

app.get("/",(req,res)=>{
    res.send(indexfile);
});

app.get("/download",async (req,res)=>{
    console.log("Download Started");
    let video_url = req.query.url;
    let video_format = req.query.type;
    let video_playlist = req.query.playlist;

    //console.log(req.query);

    if (video_playlist == "off") {
        
        let info = await ytdl.getBasicInfo(video_url);
        let video_title = info.videoDetails.title +'.'+ video_format;
        res.header("Content-Disposition", 'attachment;\  filename='+ video_title);
        ytdl(video_url ,{format:video_format}).pipe(res)
    
    }else{

        var zip = new JSZip();
        const playlist =  (await ytpl(video_url)).items;
        
        for (const video of playlist) {
            var video_title = video.title;
            var lienVideo = video.url;
            var videoConvert = ytdl(lienVideo);      
            zip.file(video_title + '.' + video_format, videoConvert);
        }
        res.header("Content-Disposition", 'attachment;\  filename='+ 'playlist.zip');
        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).pipe(res);
    }    
});

app.listen(process.env.PORT || 5000,()=>{
  console.log("Server Stared Successfully on port 5000");
});