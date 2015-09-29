'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = mongoose.model('User');

var sha512 = require('js-sha512').sha512;

router.post('/', function(req,res,next){

    var dataJSON = req.body;

    var user = new User(dataJSON);
    user.password = sha512(user.password);
    user.save(function (err, created) {
       if(err){
           return next(err);
       }
        res.json({success:true, user:created});
    });
});

module.exports = router;