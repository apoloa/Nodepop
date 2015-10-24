'use strict';

// require mongoose
var mongoose = require('mongoose');

var mongoDirection = (process.env.DB || require('../local_config').mongoDirection);

var configMongo = 'mongodb://' + mongoDirection + '/Nodepop';

// instance the connection
var db = mongoose.connection;

// error handler
db.on('error', function(err) {
    console.error('Error:', err);
    process.exit(-1);
});

// connection handler
db.once('open', function() {
    console.info('Connected to Mongo');
});

// connecting
mongoose.connect(configMongo);
