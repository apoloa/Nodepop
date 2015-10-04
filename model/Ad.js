'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define schema
var adSchema = new Schema({
    name: String,
    typeAd: {type: String, enum: ['sell','want']},
    price: Number,
    typeMoney: {type: String, enum: ['euro','dollar']},
    photo: String,
    tags: {type: [String], enum: ['work', 'lifestyle', 'motor', 'mobile']}
});

adSchema.index({'name': 1});
adSchema.index({'price': 1});

adSchema.statics.list = function(filters, options) {

    console.log('Filters:',filters);
    console.log('Options', options);

    return new Promise(function(result, reject) {
        var query = Ad.find(filters);

        query.sort(options.sort);
        query.limit(options.limit);
        query.skip(options.skip);

        query.exec(function(err, rows) {
            if (err) {
                reject(err);
            } else {
                result(rows);
            }
        });
    });
};

// Save AdSchema in Mongoose
var Ad =  mongoose.model('Ad', adSchema);

// Export model in module
module.exports = Ad;
