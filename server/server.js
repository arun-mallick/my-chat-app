const path = require('path');
var publicPath = path.join(__dirname,'../public');
const express = require('express');
const port = process.env.PORT || 3000;
const http = require('http');
const {messageGenerator,messageGeneratorLoaction} = require('./utils/message');
const {isRealString} = require('./utils/validator');
const {User} = require('./utils/users');
var app = express();
var users = new User();
const socketIO = require('socket.io')
app.use(express.static(publicPath));

var server = http.createServer(app);
var io = socketIO(server);
io.on('connection',(socket)=>{
    socket.on('disconnect',()=>{
        console.log("User disconnected");
        var user = users.removeUser(socket.id);
        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage',messageGenerator('Admin', `${user.name} has left`));
        }
    })
    //socket.emit('newMessageEvent',messageGenerator('Admin','Welcome to chat app'))
    
    socket.on('createMssg',(data,callback)=>{
        //socket.emit('newMessageEvent',{from:data.from,text:data.text,createdAt:new Date()});
        //io.emit('newMessageEvent',messageGenerator(data.from,data.text));
        var user = users.getUser(socket.id);
        if(user && isRealString(data.text)){
            io.to(user.room).emit('newMessage',messageGenerator(user.name,data.text))
        }
        
        callback && callback('Acknowledged');
    })
    socket.on('join',(data,callback)=>{
        if(!isRealString(data.name) || !isRealString(data.room)){
            return callback("Invalid name or room !");
        }
        socket.join(data.room);
        users.removeUser(socket.id);
        users.addUser(socket.id,data.name,data.room);
        io.to(data.room).emit('updateUserList',users.getUserList(data.room));
        socket.emit('newMessage', messageGenerator('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(data.room).emit('newMessage', messageGenerator('Admin', `${data.name} has joined`));
        callback();
    })
    socket.on('newLocation',(data)=>{
        console.log(`lattitude: ${data.lattitude}`)
        io.emit('newLocationMaps',messageGeneratorLoaction("User",data.lattitude,data.longitude))
    });
})

server.listen(port,()=>{
    console.log("App is running at 3000")
})