"use strict";

// Import Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Define schema
var userSchema = new Schema({
    name: String,
    mail: String,
    password: String
});

// Save UserSchema to Mongoose
var Usuario = mongoose.model('Usuario', userSchema);

module.exports = Usuario;