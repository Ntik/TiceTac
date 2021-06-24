var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
})

var userModel = mongoose.model('users', usersSchema)


module.exports = userModel;