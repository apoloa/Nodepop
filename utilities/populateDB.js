'use strict';

require('../lib/mongooseConnector');
var Ad = require('../model/Ad');
var User = require('../model/User');

var populateCollection = require('./populateCollection');

populateCollection(Ad,'utilities/AdsExample.json').then(function(res) {
    console.log(res);
    populateCollection(User,'utilities/UsersExample.json').then(function(res) {
        console.log(res);
        process.exit(0);
    });
}).catch(function(err) {
    console.error('Error to populateCollection', err);
});
