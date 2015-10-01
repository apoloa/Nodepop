"use strict";


var Ad = require('../model/Ad');
var User = require('../model/User');

var populateCollection = require('./populateCollection');

populateCollection(Ad,'utilities/AdsExample.json').then(function(res){
    console.log(res);
}).catch(function(err){
    console.error('Error to populateCollection', err);
});
populateCollection(User,'utilities/UsersExample.json').then(function(res){
    console.log(res);
}).catch(function(err){
    console.error('Error to populateCollection', err);
});
