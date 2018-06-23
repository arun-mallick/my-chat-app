const path = require('path');
var publicPath = path.join(__dirname,'../public');
const express = require('express');
const port = process.env.PORT || 3000;
const http = require('http');
var app = express();
const socketIO = require('socket.io')
app.use(express.static(publicPath));

var server = http.createServer(app);
var io = socketIO(server);
io.on('connection',(socket)=>{
    console.log("New user connected");
    socket.on('disconnect',()=>{
        console.log("User disconnected");
    })
    socket.emit('newUser',{from:'Admin',text:'Welcome to chat app'});
    socket.broadcast.emit('newUser',{from:'Admin',text:'New user has joined'})
    socket.on('createnewMessageEvent',(data)=>{
        console.log('create email',data.text)
        //socket.emit('newMessageEvent',{from:data.from,text:data.text,createdAt:new Date()});
        io.emit('newMessageEvent',{from:data.from,text:data.text,createdAt:new Date()});
    })
})

server.listen(port,()=>{
    console.log("App is running at 3000")
})