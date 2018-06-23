var socket = io();
socket.on('connect',function(){
    console.log("Connected");
    socket.emit('createnewMessageEvent',{from:'Arun',text:'Hey team Lets meet at 7 pm!'})
});
socket.on('disconnect',function(){
    console.log("Disconnected");
})
 socket.on('newUser',function(data){
    console.log("fromAdmin",data.text)
 });

