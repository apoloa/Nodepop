'use strict';

var fs = require('fs');

/**
 * This function remove a collection of MongoDB
 * @param collection The collection to remove
 * @returns {Promise} Promise with the collection removed or an error
 */
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

/**
 * This function read a file and returns a promise
 * @param file Path of the file
 * @returns {Promise} Promise with the content of the file or an error
 */
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

/**
 *
 * @param data
 * @returns {Promise}
 */
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

/**
 *
 * @param arJson
 * @param collection
 * @returns {Promise}
 */
function insertJSON(arJson, collection) {
    console.log("Inserting json in DB");
    var promise = new Promise(function (resolve, reject) {
        var data = [];
        arJson.forEach(function (element, index) {
            var objToInsert = new collection(element);

            objToInsert.save(function (err, created) {
                if (err) {
                    reject(err);
                }

                data.push(created);

                if(index == arJson.length -1){
                    resolve(data);
                }
            });
        });

    });
    return promise;
}

/**
 *
 * @param collection
 * @param file
 * @returns {Promise}
 */
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
        ).then(function(data){
                results(data);
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
};

/**
 * Export module to use in other modules
 * @type {Function} That can populate Collection in MongoDB
 */
module.exports = populateCollection;
