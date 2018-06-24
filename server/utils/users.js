class User {
    constructor(){
        this.users = [];
    }
    addUser(id,name,room){
        var users = {
            id,
            name,
            room
        }
        this.users.push(users);
        return users;
    }
    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id != id);
        }
        return user;
    }
    getUser(id){
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList(room){
        var users = this.users.filter((user) => user.room === room);
        var arrayNames = users.map((user) => user.name);
        return arrayNames;
    }
}

module.exports = {User};