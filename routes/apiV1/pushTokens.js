'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const User = mongoose.model('User');

var authentication = require('../../lib/jwtAuth');

router.use(authentication());

// jscs: disable
/**
 * @api {put} /apiV1/users/token  NotificationToken
 * @apiVersion 1.0.1
 * @apiGroup Users
 * @apiDescription Add a token from user
 *
 * @apiParam {String} platform Platform of the token (only: ios, android)
 * @apiParam {String} tokenPush Password of the user
 * @apiParam {String} token Token from registered user
 *
 * @apiHeader {String} lang=en Language of the results of the API.
 *
 * @apiHeaderExample {json} Request-Example:
 *  "platform":"a@a.com",
 *  "tokenPush":"********",
 *  "token":"**********"
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
 *      "tokens": [{
 *          "platform": "ios",
 *          "_id": "XXXXXXXXXXXX"
 *         }]
 *      }
 *  }
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
router.put('/',function(req, res, next) {
    let user = req.decoded;
    console.log(user._id);

    if (!req.body.tokenPush) {
        return next(new Error(express.errorMessageEnum.TOKENPUSH_REQUIRED));
    }
    if (!req.body.platform) {
        return next(new Error(express.errorMessageEnum.PLATFORM_REQUIRED));
    }
    if (req.body.platform.toLocaleLowerCase() !== 'android' &&
        req.body.platform.toLocaleLowerCase() !== 'ios') {
        return next(new Error(express.errorMessageEnum.INVALID_PLATFORM));
    }

    User.addTokenPush(user._id,req.body.tokenpush,req.body.platform)
        .then(function(data) {
            return res.json({'success': true, 'user': data});
        })
        .catch(function(err) {
            console.error('Error in add token push method', err);
            return next(new Error(express.errorMessageEnum.ERROR_DATABASE));
        });
});

module.exports = router;
