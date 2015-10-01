'use strict';

var mongoose = require('mongoose');
var ErrorMessage = mongoose.model('ErrorMessage');
var express = require('express');



// Get messages enum.
function getErrorMessagesFromCollection(rows){
    var erroMessageEnum = {};
    var promise = new Promise(function(result, reject){
        rows.forEach(function(element,index){
            try{
                erroMessageEnum[element.identifier] = element.id;
            }catch(err){
                reject(err);
            }
            if(index == rows.length -1){
                result(erroMessageEnum);
            }
        });
    });
    return promise;
}

function getEnums(){
    ErrorMessage.listIdentifiers().then(getErrorMessagesFromCollection).then(function(res){
        console.log(express.prototype);
        express.errorMessageEnum = res;
        console.log(express.errorMessageEnum);
    }).catch(function(err){
        console.error(err);
    });
}

getEnums();

function extractLanguageForRequest(req){
    let header;
    if(req.headers.lang){
        switch(req.headers.lang){
            case 'es':
                header = 'es';
                break;
            case 'en':
                header = 'en';
                break;
            default:
                header = 'en';
        }
    }
    return header;
}

module.exports = function(){
    return function(err, req, res, next){
        if(err){
            var language = extractLanguageForRequest(req);
            ErrorMessage.getErrorMessage(err,language)
                .then(function(errorMessage){
                    console.log(errorMessage);
                })
                .catch(function(err){
                    console.error(err);
                });
        }
    };
};