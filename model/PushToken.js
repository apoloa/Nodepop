"use strict";

// Import Mongoose
var mongoose = require('mongoose');

// Define schema
var pushTokenSchema = mongoose.Schema({
    platform: {type: String, enum:['ios', 'android']},
    token: String,
    user: String
});

// Save PushTokenSchema in Mongoose
var PushToken = mongoose.model('PushToken', pushTokenSchema);

module.exports = PushToken;