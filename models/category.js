const mongoose = require('mongoose');
const db = require('./db');

let categorySchema = mongoose.Schema({
    name:String,
    alias:String,
    keywords:String,
    describe:String
});

let categoryModel = mongoose.model('category',categorySchema);
module.exports = categoryModel;