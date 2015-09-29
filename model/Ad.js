'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Define schema
var adSchema = new Schema({
    name: String,
    typeAd: {type: String, enum:['sell','want']},
    price: Number,
    typeMoney: {type:String, enum:['euro','dollar']},
    photo: String,
    tags: {type:[String], enum: ['work', 'lifestyle', 'motor', 'mobile']},
});

adSchema.statics.list = function(filters){

    var promise = new Promise(function(result, reject){
        var query = Ad.find(filters);

        query.sort('name');

        query.exec(function(err,rows){
            if(err){
                reject(err);
            }else{
                result(rows);
            }
        });
    });
    return promise;

};


// Save AdSchema in Mongoose
var Ad =  mongoose.model('Ad', adSchema);

// Export model in module
module.exports = Ad;