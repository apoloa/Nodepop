'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * This Schema contains the message in one specific language
 */
var messageLocation = new Schema({
    language: {type: String, enum: ['es','en']},
    message: String
});

/**
 * This Schema contains the message identifier and the strings with description from error
 */
var errorMessageSchema = mongoose.Schema({
    identifier: {type: String, uppercase: true, unique: true},
    statusCode: {type: Number, enum: [404,500,400,401,403]},
    messages: [messageLocation]
});

errorMessageSchema.statics.list = function() {

    var promise = new Promise(function(result, reject) {
        var query = ErrorMessage.find();

        query.sort('identifier');

        query.exec(function(err, rows) {
            if (err) {
                reject(err);
            } else {
                result(rows);
            }
        });
    });
    return promise;

};

errorMessageSchema.statics.listIdentifiers = function() {
    var promise = new Promise(function(result, reject) {
        var query = ErrorMessage.find();

        query.sort('identifier');
        // Only these fields will be returned.
        query.select('__id identifier');
        query.exec(function(err, rows) {
            if (err) {
                reject(err);
            } else {
                result(rows);
            }
        });
    });
    return promise;
};

errorMessageSchema.statics.getErrorMessage = function(id, lang) {
    var promise = new Promise(function(result, reject) {
        var query = ErrorMessage.findOne(
            {'_id': id},
            {'messages': {$elemMatch: {language: lang}}}
        );
        query.sort('identifier');
        // Only these fields will be returned.
        query.select('identifier statusCode messages.message');
        query.exec(function(err, rows) {
            if (err) {
                reject(err);
            } else {
                result(rows);
            }
        });
    });
    return promise;
};

/**
 * Save the error message schema in mongoose to use later.
 * @type {*|Model|Aggregate} The Error Message Schema
 */
var ErrorMessage = mongoose.model('ErrorMessage', errorMessageSchema);

module.exports = ErrorMessage;
