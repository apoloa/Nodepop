'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var sha512 = require('js-sha512').sha512;
var validator = require('validator');

router.post('/', function(req,res,next){

    // Check the data received
    if(!req.body.name){
        return next();
    }
    if(!req.body.email){
        return next();
    }
    if(!validator.isEmail(req.body.email)){
        return next();

    }
    if(!req.body.password){
        return next();
    }

    // First check is user exists.
    var dataJSON = req.body;

    var user = new User(dataJSON);
    user.password = sha512(user.password);
    user.save(function (err, created) {
       if(err){
           console.log(err);
           if(err.code === 11000){
               return next(err.code);
           }
           return next(err);
       }
        res.json({success:true, user:created});
    });
});

module.exports = router;