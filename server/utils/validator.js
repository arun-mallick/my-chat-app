var isRealString = (data) => {
    return typeof data === 'string' && data.trim().length>0;
}
module.exports = {
    isRealString
}