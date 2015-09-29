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
    language: {type: String, enum:['es','eng']},
    message: String
});

/**
 * This Schema contains the message identifier and the strings with description from error
 */
var errorMessageSchema = mongoose.Schema({
    id: Number,
    messages: [messageLocation]
});

/**
 * Save the error message schema in mongoose to use later.
 * @type {*|Model|Aggregate} The Error Message Schema
 */
var ErrorMessage = mongoose.model('ErrorMessage', errorMessageSchema);

module.exports = ErrorMessage;