'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

const sha512 = require('js-sha512').sha512;
const validator = require('validator');
// jscs: disable
/**
 * @api {post} /apiV1/users/ Register
 * @apiVersion 1.0.1
 * @apiGroup Users
 * @apiDescription Register a new user
 * @apiParam {String} name Name of the user
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 *
 * @apiHeader {String} lang=en Language of the results of the API.
 *
 * @apiHeaderExample {json} Request-Example:
 *  "name" : "A"
 *  "email":"a@a.com",
 *  "password":"********"
 *
 * @apiSuccessExample {json} Success-Response:
 *  {
 *  "success": true,
 *  "user": {
 *      "__v": 0,
 *      "name": "a",
 *      "email": "a@a.com",
 *      "password": "XXXXXXXX",
 *      "_id": "XXXXXXXX",
 *      "tokens": []
 *      }
 *  }
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
    // Check the data received
    let errorValidators;

    if (!req.body.name) {
        errorValidators = new Error(express.errorMessageEnum.NAME_REQUIRED);
        return next(errorValidators);
    }
    if (!req.body.email) {
        errorValidators = new Error(express.errorMessageEnum.EMAIL_REQUIRED);
        return next(errorValidators);
    }
    if (!validator.isEmail(req.body.email)) {
        errorValidators = new Error(express.errorMessageEnum.EMAIL_IS_NOT_VALID);
        return next(errorValidators);
    }
    if (!req.body.password) {
        errorValidators = new Error(express.errorMessageEnum.PASSWORD_REQUIRED);
        return next(errorValidators);
    }

    // First check is user exists.
    let dataJSON = req.body;

    let user = new User(dataJSON);
    user.password = sha512(user.password);
    user.save(function(err, created) {
        if (err) {
            if (err.code === 11000) {
                console.warn('WARN: The email %s was already registered',req.body.email);
                let errorUserExists = new Error(express.errorMessageEnum.EMAIL_ALREADY_REGISTERED);
                return next(errorUserExists);
            }
            return next(err);
        }
        res.status(201);
        res.json({success: true, user: created});
    });
    return;
});

module.exports = router;
