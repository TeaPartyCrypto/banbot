const mongoose = require('mongoose');

const warning = new mongoose.Schema({
    Guild_ID:{type:String, require:true},
    userID:{type:String},
})

const warning_model = mongoose.model("Warning", warning);
module.exports = warning_model;