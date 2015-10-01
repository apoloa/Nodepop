'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var sha512 = require('js-sha512').sha512;
var validator = require('validator');

/**
 * @function /users
 * @implements POST
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @description Register a new user in the database
 * @return {object} Object with {success:{true:false} error: {id,status,message} or user}
 */
router.post('/', function(req,res,next){

    // Check the data received
    if(!req.body.name){
        return next(express.errorMessageEnum.NAME_REQUIRED);
    }
    if(!req.body.email){
        return next(express.errorMessageEnum.EMAIL_REQUIRED);
    }
    if(!validator.isEmail(req.body.email)){
        return next(express.errorMessageEnum.EMAIL_IS_NOT_VALID);

    }
    if(!req.body.password){
        return next(express.errorMessageEnum.PASSWORD_REQUIRED);
    }

    // First check is user exists.
    var dataJSON = req.body;

    var user = new User(dataJSON);
    user.password = sha512(user.password);
    user.save(function (err, created) {
       if(err){
           console.log(err);
           if(err.code === 11000){
               console.log('The email %s was already registered',req.body.email);
               return next(express.errorMessageEnum.EMAIL_ALREADY_REGISTERED);
           }
           return next(err);
       }
        res.status(201);
        res.json({success:true, user:created});
    });
});

module.exports = router;