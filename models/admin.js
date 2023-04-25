const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    Guild_ID:{type:String, require:true},
    Role:{type:String},
    userid:{type:String},
})

const admin_model = mongoose.model("admin", admin);
module.exports = admin_model;