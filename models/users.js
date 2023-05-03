const mongoose = require('mongoose');

const users = new mongoose.Schema({
    Guild_ID:{type:String, require:true},
    username:{type:String},
})

const user_model = mongoose.model("user", users);
module.exports = user_model;