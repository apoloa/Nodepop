'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Ad = mongoose.model('Ad');

router.get('/', function(req,res,next){
    console.log(req.headers);
    Ad.list({})
        .then(function(rows){
            res.json({success:true, data: rows});
        })
        .catch(function(err){
            next(err);
        });

});

module.exports = router;