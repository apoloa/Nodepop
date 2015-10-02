'use strict';

//Test of Users using Mocha

// Use database example to do the test.

var app = require('../app');
var debug = require('debug')('Practica:server');
var http = require('http');

app.set('port', 3000);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(3000);


var assert = require('assert');
var request = require('request');


describe('Ads', function(){
    it("Get simple Ads", function(){
        request('http://localhost:3000/apiV1/ads',function(error,response,body){
            assert.equals(200,response.statusCode);
            assert.equals(true, body.success);
        });
    });
});