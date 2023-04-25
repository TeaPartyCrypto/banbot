const mongoose = require('mongoose');

const interval = new mongoose.Schema({
    Guild_ID:{type:String, require:true},
    Time:{type:String},
})

const interval_model = mongoose.model("interval", interval);
module.exports = interval_model;