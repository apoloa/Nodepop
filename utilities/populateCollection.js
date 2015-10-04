'use strict';

var fs = require('fs');

/**
 * This function remove a collection of MongoDB.
 *
 * @param {Object} collection - The collection to remove
 * @returns {Promise} Promise with the collection removed or an error
 */
function removeCollection(collection) {
    console.log('Remove Collection', collection.name);
    return new Promise(function(result, reject) {
        collection.collection.drop(function(err) {
            if (err) {
                if (err.message === 'ns not found') {
                    console.warn('Database not exists, ignoring delete');
                    result(collection);
                } else {
                    reject(err);
                }
            }else {
                result(collection);
            }
        });
    });
}

/**
 * This function read a file and returns a promise.
 *
 * @param {String} file - Path of the file
 * @returns {Promise} Promise with the content of the file or an error
 */
function readFile(file) {
    console.log('Reading File', file);
    return new Promise(function(resolve, reject) {
        fs.readFile(file, {encoding: 'utf8'}, function(err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

/**
 * This function convert from JSON to Object.
 *
 * @param {String} data String with the json to convert.
 * @returns {Promise} Promise with the content of the data converted in Object.
 * */
function parseDataFromJson(data) {
    return new Promise(function(resolve, reject) {
        try {
            console.log('Parsing data to JSON');
            var dataParsed = JSON.parse(data);
            resolve(dataParsed);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * This function can be insert Object in Database.
 *
 * @param {Object} object Object with the data to insert in collection.
 * @param {Object} Collection Object that represents a mongoose collection.
 * @returns {Promise}
 */
function insertJSON(object, Collection) {
    console.log('Inserting json in DB');
    return new Promise(function(resolve, reject) {
        var data = [];
        object.forEach(function(element, index) {
            var objToInsert = new Collection(element);
            objToInsert.save(function(err, created) {
                if (err) {
                    reject(err);
                }

                data.push(created);

                if (index == object.length - 1) {
                    resolve(data);
                }
            });
        });

    });
}

/**
 * This function insert the content of the file in collection.
 *
 * @param {Object} collection - Objects that represents a mongoose collection.
 * @param {String} file - Path from the file.
 * @returns {Promise} - A Promise with the result of populate the collection.
 */
var populateCollection = function(collection, file) {
    return new Promise(function(results, reject) {
        removeCollection(collection)
            .then(
            function() {
                return readFile(file);
            }
        )
            .then(parseDataFromJson)
            .then(
            function(res) {
                return insertJSON(res, collection);
            }
        ).then(function(data) {
                results(data);
            })
            .catch(function(err) {
                reject(err);
            });
    });
};

/**
 * Export module to use in other modules
 *
 * @type {Function} That can populate Collection in MongoDB
 */
module.exports = populateCollection;
