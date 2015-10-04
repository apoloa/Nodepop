'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var sha512 = require('js-sha512').sha512;
var jwt = require('jsonwebtoken');
var config = require('../../local_config');
var validator = require('validator');

// jscs: disable
/**
 * @api {post} /apiV1/users/authenticate Authenticate
 * @apiVersion 1.0.1
 * @apiGroup Users
 * @apiDescription Authenticate a registered user
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 *
 * @apiHeader {String} lang=en Language of the results of the API.
 *
 * @apiHeaderExample {json} Request-Example:
 *  "email":"a@a.com",
 *  "password":"********"
 *
 * @apiSuccessExample {json} Success-Response:
 * {"success":true,
 *  "token": "XXXXXXXX"}
 *
 * @apiError success 'False'
 * @apiError message Error message
 * @apiError message.id Error id message
 * @apiError message.status Response status code
 * @apiError message.description Description of the error
 *
 * @apiErrorExample {json} Error-Response:
 * {"success":false,
 *  "message":{
 *      "identifier": "ERROR_DATABASE",
 *       "statusCode": "400",
 *       "messages": "Error in database"
 *    }
 * }
 *
 */
// jscs: enable
router.post('/', function(req, res, next) {
    // Check parameters
    if (!req.body.email) {
        return next(new Error(express.errorMessageEnum.EMAIL_REQUIRED));
    }
    if (!validator.isEmail(req.body.email)) {
        return next(new Error(express.errorMessageEnum.EMAIL_IS_NOT_VALID));
    }
    if (!req.body.password) {
        return next(new Error(express.errorMessageEnum.PASSWORD_REQUIRED));
    }

    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            console.error('Error in authenticate method:',err);
            return next(express.errorMessageEnum.ERROR_DATABASE);
        }

        if (!user) {
            return next(express.errorMessageEnum.USER_NOT_FOUND);
        } else if (user) {

            // check if password matches
            if (user.password != sha512(req.body.password)) {

                return next(express.errorMessageEnum.PASSWORD_REQUIRED);

            } else {
                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, config.jwt.secret, {
                    expiresInMinutes: config.jwt.expiresInMinutes
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    token: token
                });
            }
        }
    });
});

module.exports = router;
