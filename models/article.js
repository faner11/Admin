const mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    title:String,
    describe:String,
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    tags:String,
    titlepic:Buffer,
    visibility:Boolean,
    time:{
        type:Date,
        default:Date.now()
    }
});
let articleModel = mongoose.model('article',articleSchema);
module.exports = articleModel;