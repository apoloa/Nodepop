'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Ad = mongoose.model('Ad');
var authentication = require('../../lib/jwtAuth');

router.use(authentication());
// jscs: disable
/**
 * @api {get} /apiV1/ads Request a list of ads
 * @apiVersion 1.0.1
 * @apiGroup Ads
 * @apiDescription Get a list of ads filtered with above parameters or headers.
 * @apiParam {String} [tag] Tag to filter
 * @apiParam {String} [typeAd] Type to ad to filter
 * @apiParam {String} [name] Name (REGEXP) to filter
 * @apiParam {String} [price] Price using the format (min-max) to filter
 * @apiParam {String} [start] Pagination option starts with a number row
 * @apiParam {String} [limit] Pagination option limit the results
 * @apiParam {String} [sort] Sort option, represents a field to order.
 * @apiParam {String} [includeTotal] Boolean variable, if is true API compute total prices of results.
 * @apiParam {String} token Token of user registered.
 *
 * @apiHeader {String} [x-filter-tag] Tag to filter
 * @apiHeader {String} [x-filter-typead'] Type to ad to filter
 * @apiHeader {String} [x-filter-name] Name (REGEXP) to filter
 * @apiHeader {String} [x-filter-price] Price using the format (min-max) to filter
 * @apiHeader {String} [x-filter-start] Pagination option starts with a number row
 * @apiHeader {String} [x-filter-limit] Pagination option limit the results
 * @apiHeader {String} [x-filter-sort] Sort option, represents a field to order.
 * @apiHeader {String} [x-filter-includetotal] Boolean variable, if is true API compute total prices of results.
 * @apiHeader {String} x-access-token Token of user registered.
 *
 * @apiHeader {String} lang=en Language of the results of the API.
 *
 * @apiHeaderExample {json} Request-Example:
 *  "lang":es
 *  "x-filter-tag": "mobile",
 *  "x-filter-typead": "sell",
 *  "x-filter-name": "i",
 *  "x-filter-price": "10-5000",
 *  "x-filter-start": "0",
 *  "x-filter-limit": "5",
 *  "x-filter-sort": "name",
 *  "x-filter-includeTotal": "true",
 *  "x-access-token": token
 *
 * @apiSuccessExample {json} Success-Response:
 * {"success":true,
 *  "data":
 *      [{"_id":"56112877f278e8dc41e150a7",
 *      "name":"Ferrari F12 Berlinetta",
 *      "typeAd":"want",
 *      "price":309437,
 *      "typeMoney":"euro",
 *      "photo":
 *      "ferrar_f12_berlinetta.jpg",
 *      "__v":0,
 *      "tags":["motor","lifestyle"]}]}
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
 *      "identifier": "TOKENPUSH_REQUIRED",
 *       "statusCode": "400",
 *       "messages": "Se requiere un token"
 *    }
 * }
 *
 */
// jscs: enable
router.get('/',function(req, res, next) {

    let query = req.query;
    let filters = {};
    let options = {};

    let tag = query.tag || req.headers['x-filter-tag'];
    if (tag) {
        if (typeof tag === 'object') {
            filters.tags = { $in: tag };
        } else {
            filters.tags = tag;
        }
    }

    let typeAd = query.typeAd || req.headers['x-filter-typead'];
    if (typeAd) {
        filters.typeAd = typeAd;
    }

    let name = query.name || req.headers['x-filter-name'];
    if (name) {
        filters.name = new RegExp('^' + name, 'i');
    }

    let price = query.price || req.headers['x-filter-price'];
    if (price) {
        if (typeof price === 'string') {
            let elements = price.split('-');
            if (elements.length === 2) {
                let conditions = {};
                if (elements[0].length !== 0) {
                    conditions.$gte = elements[0];
                }
                if (elements[1].length !== 0) {
                    conditions.$lte = elements[1];
                }
                filters.price = conditions;
            } else {
                if (elements.length === 1) {
                    console.log(isNaN(elements[0]));
                    if (isNaN(elements[0]) === false) {
                        let numberValue = Number(elements[0]);
                        if (numberValue !== 0) {
                            filters.price = numberValue;
                        } else {
                            return next(Error(express.errorMessageEnum.INVALID_PRICE));
                        }
                    } else {
                        console.log('PRICE_INVALID');

                        return next(Error(express.errorMessageEnum.INVALID_PRICE));
                    }
                }
            }
        }
    }

    let start = query.start || req.headers['x-filter-start'];
    if (start) {
        if (isNaN(start) === false) {
            console.log('start');
            options.skip = Number(start);
        }

    }

    let limit = query.limit || req.headers['x-filter-limit'];
    if (limit) {
        if (isNaN(limit) === false) {
            options.limit = Number(limit);
        }
    }

    let sort = query.sort || req.headers['x-filter-sort'];
    if (sort) {
        options.sort = sort;
    }
    let includeTotal = query.includeTotal || req.headers['x-filter-includetotal'];

    Ad.list(filters, options)
        .then(function(rows) {
            if (includeTotal) {
                if (includeTotal === 'true') {
                    let total = 0;
                    for (let i = 0; i < rows.length; i++) {
                        total += rows[i].price;
                    }
                    res.json({success: true, data: rows, total: total});
                }
            } else {
                res.json({success: true, data: rows});
            }

        })
        .catch(function(err) {
            console.error('Error in get ads method:',err);
            let errorDatabase = new Error(express.errorMessageEnum.ERROR_DATABASE);
            return next(errorDatabase);
        });

});

module.exports = router;
