'use strict';

// Import Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pushTokenSchema = mongoose.Schema({
    platform: {type: String, enum: ['ios', 'android']},
    token: String
});

// Define schema
var userSchema = new Schema({
    name: {type: String, trim: true},
    email: {type: String, trim: true, lowercase: true, unique: true},
    password: String,
    tokens: [pushTokenSchema]
});

userSchema.statics.addTokenPush = function(id, token, platform) {
    return new Promise(function(result, reject) {
        var query = User.findOne({'_id': id});
        query.exec(function(err, row) {
            if (err) {
                console.error('Error to retrieve user PushToken,',err);
                return reject(err);
            }
            row.tokens.push({'platform': platform, 'token': token});
            row.save(function(err, res) {
                if (err) {
                    console.error('Error to save user Pushtoken,',err);
                    return reject(err);
                } else {
                    result(res);
                }
            });

        });
    });
};

// Save UserSchema to Mongoose
var User = mongoose.model('User', userSchema);

module.exports = User;
