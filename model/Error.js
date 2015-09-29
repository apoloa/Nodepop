"use strict";

// Import Mongoose
var mongoose = require('mongoose');

// Define schema
var errorSchema = mongoose.Schema({
    id: Number,
    price: Number,
    photo: String,
    tags: [String]
});

// Save errorSchema in Mongoose
var Error = mongoose.model('Error', errorSchema);

module.exports = Error;