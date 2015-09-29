"use strict";

// Import Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define schema
var adSchema = new Schema({
    name: String,
    typeAd: {type: String, enum:['sell','want']},
    price: Number,
    typeMoney: {type:String, enum:['euro','dollar']},
    photo: String,
    tags: {type:[String], enum: ['work', 'lifestyle', 'motor', 'mobile']}
});

// Save AdSchema in Mongoose
var Ad =  mongoose.model('Ad', adSchema);

// Export model in module
module.exports = Ad;