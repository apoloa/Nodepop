'use strict';

//Test of Users using Mocha

// Use database example to do the test.

var app = require('../app');
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

var token = '';

describe('Nodepop Api Test', function() {
    describe('Users:', function() {
        it('Ad new user', function(done) {

            var postData = {
                name: 'test',
                email: 'test@test.com',
                password: 'holahola'
            };

            assert.doesNotThrow(function() {
                request.post({
                    url: 'http://localhost:3000/apiV1/users',
                    form: postData
                }, function(error, response, body) {
                    if (error) {
                        throw new Error(error);
                    }

                    let elements = JSON.parse(body);
                    assert.equal(201, response.statusCode);
                    assert.equal(true, elements.success);
                    assert.equal(postData.name, elements.user.name);
                    assert.equal(postData.email, elements.user.email);

                    done();
                });
            });
        });
        it('Ad same user', function(done) {

            var postData = {
                name: 'test',
                email: 'test@test.com',
                password: 'holahola'
            };

            assert.doesNotThrow(function() {
                request.post({
                    url: 'http://localhost:3000/apiV1/users',
                    form: postData
                }, function(error, response) {
                    if (error) {
                        throw new Error(error);
                    }

                    assert.equal(400, response.statusCode);
                    done();
                });
            });
        });

        it('Authenticate:', function(done) {

            var postData = {
                email: 'test@test.com',
                password: 'holahola'
            };

            assert.doesNotThrow(function() {
                request.post({
                    url: 'http://localhost:3000/apiV1/users/authenticate',
                    form: postData
                }, function(error, response, body) {
                    if (error) {
                        throw new Error(error);
                    }
                    let elements = JSON.parse(body);
                    assert.equal(200, response.statusCode);
                    assert.equal(true, elements.success);
                    //assert.equal(201,response.statusCode);
                    token = elements.token;

                    done();
                });
            });
        });
    });
    describe('Ads:', function() {
        it('Get simple Ads without authentication', function(done) {
            assert.doesNotThrow(function() {
                request('http://localhost:3000/apiV1/ads', function(error, response) {
                    assert.equal(403, response.statusCode);
                    done();
                });
            });
        });
        it('Get simple Ads with authentication', function(done) {
            assert.doesNotThrow(function() {
                request('http://localhost:3000/apiV1/ads' + '?token=' + token, function(error, response, body) {
                    assert.equal(200, response.statusCode);
                    let jsonBody = JSON.parse(body);
                    assert.equal(7, jsonBody.data.length);
                    done();
                });
            });
        });
        it('Get Ads with authentication and one tag', function(done) {
            assert.doesNotThrow(function() {
                request('http://localhost:3000/apiV1/ads' + '?tag=motor&' + 'token=' + token,
                    function(error, response, body) {
                        assert.equal(200, response.statusCode);
                        let jsonBody = JSON.parse(body);
                        assert.equal(3, jsonBody.data.length);
                        done();
                    });
            });
        });
        it('Get Ads with authentication and multiple tag', function(done) {
            assert.doesNotThrow(function() {
                request('http://localhost:3000/apiV1/ads' + '?tag=motor&tag=mobile&' + 'token=' + token,
                    function(error, response, body) {
                        assert.equal(200, response.statusCode);
                        let jsonBody = JSON.parse(body);
                        assert.equal(4, jsonBody.data.length);
                        done();
                    });
            });
        });
        it('Get Ads with authentication invalid price', function(done) {
            assert.doesNotThrow(function() {
                request('http://localhost:3000/apiV1/ads' + '?price=31234a&' + 'token=' + token,
                    function(error, response) {
                        assert.equal(400, response.statusCode);
                        done();
                    });
            });
        });
        it('Get Ads with authentication range price', function(done) {
            assert.doesNotThrow(function() {
                request('http://localhost:3000/apiV1/ads' + '?price=309436-&' + 'token=' + token,
                    function(error, response, body) {
                        assert.equal(200, response.statusCode);
                        let jsonBody = JSON.parse(body);
                        assert.equal(1, jsonBody.data.length);
                        assert.equal('Ferrari F12 Berlinetta',jsonBody.data[0].name);
                        done();
                    });
            });
        });
        it('Get Ads with authentication major price', function(done) {
            assert.doesNotThrow(function() {
                request('http://localhost:3000/apiV1/ads' + '?price=10-50&' + 'token=' + token,
                    function(error, response, body) {
                        assert.equal(200, response.statusCode);
                        let jsonBody = JSON.parse(body);
                        assert.equal(0, jsonBody.data.length);
                        done();
                    });
            });
        });
        it('Get Ads with authentication type ad', function(done) {
            assert.doesNotThrow(function() {
                request('http://localhost:3000/apiV1/ads' + '?typeAd=sell&' + 'token=' + token,
                    function(error, response, body) {
                        assert.equal(200, response.statusCode);
                        let jsonBody = JSON.parse(body);
                        assert.equal(4, jsonBody.data.length);
                        done();
                    });
            });
        });
        it('Get Ads with authentication name', function(done) {
            assert.doesNotThrow(function() {
                request('http://localhost:3000/apiV1/ads' + '?name=y&' + 'token=' + token,
                    function(error, response, body) {
                        assert.equal(200, response.statusCode);
                        let jsonBody = JSON.parse(body);
                        assert.equal(1, jsonBody.data.length);
                        done();
                    });
            });
        });
        it('Get Ads with authentication included total price', function(done) {
            assert.doesNotThrow(function() {
                request('http://localhost:3000/apiV1/ads' + '?includeTotal=true&' + 'token=' + token,
                    function(error, response, body) {
                        assert.equal(200, response.statusCode);
                        let jsonBody = JSON.parse(body);
                        assert.equal(7, jsonBody.data.length);
                        assert.equal(360395.79,jsonBody.total);
                        done();
                    });
            });
        });

        it('Get Ads with authentication included total price with parameters', function(done) {
            var options = {
                url: 'http://localhost:3000/apiV1/ads',
                headers: {
                    'x-filter-includetotal': 'true',
                    'x-access-token': token
                }
            };
            assert.doesNotThrow(function() {
                request(options,
                    function(error, response, body) {
                        assert.equal(200, response.statusCode);
                        let jsonBody = JSON.parse(body);
                        assert.equal(7, jsonBody.data.length);
                        assert.equal(360395.79,jsonBody.total);
                        done();
                    });
            });
        });

        it('Get Ads with all parameters', function(done) {
            var options = {
                url: 'http://localhost:3000/apiV1/ads' + '?includeTotal=true&' + 'token=' + token,
                headers: {
                    'x-filter-tag': 'mobile',
                    'x-filter-typead': 'sell',
                    'x-filter-name': 'i',
                    'x-filter-price': '10-5000',
                    'x-filter-start': '0',
                    'x-filter-limit': '5',
                    'x-filter-sort': 'name',
                    'x-filter-includeTotal': 'true',
                    'x-access-token': token
                }
            };
            assert.doesNotThrow(function() {
                request(options,
                    function(error, response, body) {
                        assert.equal(200, response.statusCode);
                        let jsonBody = JSON.parse(body);
                        assert.equal(1, jsonBody.data.length);
                        assert.equal(1079,jsonBody.total);
                        done();
                    });
            });
        });
    });
    describe('Token Push:', function() {
        it('Put token push without token', function(done) {
            var options = {
                url: 'http://localhost:3000/apiV1/users/token',
                method: 'PUT'
            };
            assert.doesNotThrow(function() {
                request(options,
                    function(error, response) {
                        assert.equal(403, response.statusCode);
                        done();
                    });
            });
        });
        it('Put token in user', function(done) {
            var putData = {
                tokenPush: 'fhdknfaldfcay5735nycuyqweyut3q52bpqubjyvqwhegtt',
                platform: 'ios'
            };
            var options = {
                url: 'http://localhost:3000/apiV1/users/token',
                method: 'PUT',
                form: putData,
                headers: {
                    'x-access-token': token
                }
            };
            assert.doesNotThrow(function() {
                request(options,
                    function(error, response, body) {
                        assert.equal(200, response.statusCode);
                        let jsonBody = JSON.parse(body);
                        assert.equal(1, jsonBody.user.tokens.length);
                        done();
                    });
            });
        });

    });
});
