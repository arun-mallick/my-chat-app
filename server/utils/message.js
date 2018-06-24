var moment = require('moment');
var messageGenerator = function(from,text){
    return {
        from,
        text,
        createdAt:moment().valueOf()
    }
};
var messageGeneratorLoaction = function(from,lat,long){
    return {
        from,
        url:`https://www.google.com/maps?q=${lat},${long}`,
        createdAt:moment().valueOf()

    }
};

module.exports = {messageGenerator,messageGeneratorLoaction};