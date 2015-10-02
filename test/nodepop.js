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


describe('Nodepop Api Test', function(){
    describe('Ads:', function(){
        it('Get simple Ads', function(done){
            assert.doesNotThrow(function(){
                request('http://localhost:3000/apiV1/ads',function(error,response,body){
                    assert.equal(200,response.statusCode);

                    done();
                });
            });
        });
    });
    describe('Users:', function(){
        it('Ad new user', function(done){
            console.log('llamado');

            var postData = {
                name: 'test',
                email: 'test@test.com',
                password: 'holahola'
            };

            assert.doesNotThrow(function(){
                console.log("Se llama¿?");
                request.post({url:'http://localhost:3000/apiV1/users', form: postData}, function(error,response,body){
                    if(error){
                        throw new Error(error);
                    }
                    console.log("Hecho Request");
                    console.log('ERROR:',error);
                    console.log('BODY',body);
                    console.log('Response', response.statusCode);
                    assert.equal(201,response.statusCode);
                    //assert.equal(201,response.statusCode);

                    done();
                });
            });

            console.log('Inicializado');
        });
    });
});

