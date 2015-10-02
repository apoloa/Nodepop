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
        express.errorMessageEnum = res;
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
    }else{
        header = 'en';
    }
    return header;
}
function errorAPIHandler(err, req, res, next){
    if(err){
        var language = extractLanguageForRequest(req);
        console.log(language);
        ErrorMessage.getErrorMessage(err,language)
            .then(function(errorMessage){
                console.log(errorMessage);
                res.status(errorMessage.statusCode);
                res.json({id:errorMessage.identifier, status:errorMessage.statusCode,description:errorMessage.messages[0].message});
                return;
            })
            .catch(function(err){
                console.error(err);
                next();
            });
    }
}
module.exports = errorAPIHandler;
