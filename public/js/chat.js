var socket = io();

function bottomScroll(){
    var messages = $('#display-chat');
    var newMessages = messages.children('li:last-child');
     
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');

    var newMessagesHeight = newMessages.innerHeight();
    var lastMessagesHeight = newMessages.prev().innerHeight();

    if(clientHeight + scrollTop + newMessagesHeight + lastMessagesHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }


}
socket.on('connect',function(){
    var params = $.deparam(window.location.search);
    console.log("Params ",params)
    console.log("Connected");
    socket.emit('createnewMessageEvent',{
        from:'Arun',text:'Hey team Lets meet at 7 pm!'
    },function(data){
        console.log("Acknowledgement",data);
    });
    socket.emit('join',params,function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log("No error");
        }
    });
});
socket.on('disconnect',function(){
    console.log("Disconnected");
})
socket.on('newMessage',function(data){
    var time = moment(data.createdAt).format('h:mm a')
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
        text:data.text,
        from:data.from,
        createdAt:time
    })
    $("#display-chat").append(html);

    bottomScroll();
    // var li = $('<li></li>');
    // li.text(`${data.from} ${time} : ${data.text}`);
    // $("#display-chat").append(li);
});
socket.on('newLocationMaps',function(data){
    var time = moment(data.createdAt).format('h:mm a')
    // var li = $('<li></li>');
    // var a = $('<a target="_blank">My Current Location</a>');
    // li.text(`${data.from} ${time} :`);
    // a.attr('href',data.url)
    // li.append(a);
    // $("#display-chat").append(li);

    var template = $('#location-message-template').html();
    var html = Mustache.render(template,{
        url:data.url,
        from:data.from,
        createdAt:time
    })
    $("#display-chat").append(html);
    bottomScroll();
})
socket.on('updateUserList',function(data){
    console.log(data);
    var ol = $("<ol></ol>");
    data.forEach(function(user){
        ol.append($("<li></li>").text(user));
    })
    $("#users").html(ol);
})
socket.on('newUser',function(data){
    console.log("newUser",data.text)
});
$('#mssg-from').on('submit',function(e){
    e.preventDefault();
    if($('#mssg').val()){
        socket.emit('createMssg',{
            text:$('#mssg').val()
        },function(data){
            $('#mssg').val('')
            console.log("Acknowledgement -- ",data);
        })
    }else{
        alert("Please enter some text");
    }
    
});
var loc = $('#sendLocation');
loc.on('click',function(){
    if(!navigator.geolocation){
        return alert("Your browser does not support Geolocation");
    }
    loc.attr('disabled','disabled').text('Sending Location....');
    navigator.geolocation.getCurrentPosition(function(pos){
        loc.removeAttr('disabled').text('Send Location');
        socket.emit('newLocation',{
            lattitude:pos.coords.latitude,
            longitude:pos.coords.longitude
        })
    },function(){
        alert("Your location is blocked").text('Send Location');
        loc.removeAttr('disabled');
    })
});

