'use strict';

require('../lib/mongooseConnector');
var populateCollection = require('./populateCollection');
var ErrorMessage = require('../model/ErrorMessage');

populateCollection(ErrorMessage,'utilities/ErrorMessages.json').then(function(res){
    console.log(res);
    process.exit(0);
}).catch(function(err){
    console.error('Error to populateCollection', err);
});