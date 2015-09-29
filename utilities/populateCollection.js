"use strict";

var fs = require('fs');

function removeCollection(collection) {
    console.log("Remove Collection", collection.name);
    var promise = new Promise(function (result, reject) {
        collection.collection.drop(function (err) {
            if(err){
                if(err.message === 'ns not found'){
                    console.warn("Database not exists, ignoring delete");
                    result(collection);
                }else{
                    reject(err);
                }
            }else {
                result(collection);
            }
        });
    });
    return promise;
}

function readFile(file) {
    console.log("Reading File", file);
    var promise = new Promise(function (resolve, reject) {
        fs.readFile(file, {encoding: 'utf8'}, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
    return promise;
}

function parseDataToJson(data) {
    var promise = new Promise(function (resolve, reject) {
        try {
            console.log("Parsing data to JSON");
            var dataParsed = JSON.parse(data);
            resolve(dataParsed);
        } catch (err) {
            reject(err);
        }
    });
    return promise;
}

function insertJSON(arJson, collection) {
    console.log("Inserting json in DB");
    var promise = new Promise(function (resolve, reject) {
        var data = new Array(arJson.length);
        arJson.forEach(function (element) {
            var objToInsert = new collection(element);

            objToInsert.save(function (err, created) {
                if (err) {
                    reject(err);
                }

                data.push(created);
            });
        });

    });
    return promise;
}


var populateCollection = function (collection, file) {
    var promise = new Promise(function (results, reject) {
        removeCollection(collection)
            .then(
            function (res) {
                return readFile(file);
            }
        )
            .then(parseDataToJson)
            .then(
            function (res) {
                return insertJSON(res, collection);
            }
        )
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
};

// Export the module
module.exports = populateCollection;
