const mongoose = require("mongoose");
const db = require('./db');
let userSchema = mongoose.Schema({
    username:String,
    password:String
});

let userModel = mongoose.model('Admin',userSchema);
module.exports = userModel;
