'use strict';

/**
 * Your utility library for express
 */

var jwt = require('jsonwebtoken');
var configJWT = require('../local_config').jwt;
var express = require('express');
/**
 * JWT auth middleware for use with Express 4.x.
 *
 * @example
 * app.use('/api-requiring-auth', jwtAuth());
 *
 * @returns {Function} Express 4 middleware
 */
module.exports = function() {

    return function(req, res, next) {
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, configJWT.secret, function(err, decoded) {
                if (err) {
                    console.error('Error in token authentication:',err);

                    return next(express.errorMessageEnum.INVALID_TOKEN);
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } else {

            // if there is no token return error
            console.error('Token Required');
            var notFound = new Error(express.errorMessageEnum.TOKEN_REQUIRED);
            return next(notFound);

        }
    };
};
