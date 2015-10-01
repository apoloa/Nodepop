"use strict";

// Import Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define schema
var userSchema = new Schema({
    name: {type: String, trim:true},
    mail: {type: String, trim:true, lowercase:true, unique:true},
    password: String
});

// Save UserSchema to Mongoose
var User = mongoose.model('User', userSchema);

module.exports = User;