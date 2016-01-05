var Q = require('q');
var MongoClient = require('mongodb').MongoClient;
var logger = require('../../logger.js');
var settings = require('../../settings.js');
var convert = require('../../convert.js');

var connection;

module.exports = {
    /** connects to a database */
    connecting: connecting,
    /** gets the current database connection  */
    getConnection: getConnection,
    /** saves the current database connection*/
    setConnection: setConnection,
    /** performs a find operation that returna an array*/
    finding: finding,
    /** performs a find operation that returns an item*/
    findingOne: findingOne,
    /** performs an aggegation operation */
    aggregating: aggregating,
    /** inserts a new document  */
    inserting: inserting,
    /** updates matched documents  */
    updating: updating,
    /** removes matched documents  */
    removing: removing,
    /** removes matched documents  */
    counting: counting
}

function connecting() {
    logger.debug("mongoDB connecting : " + JSON.stringify(settings.mongoUrl));
    var deferred = Q.defer();
    MongoClient.connect(settings.mongoUrl, function (err, db) {
        convert.cllbck2prom(err, db, deferred);
    });
    return deferred.promise;
}

function getConnection() {
    return connection;
}

function setConnection(db) {
    connection=db;
}
function finding(colName, query, proj, skip, limit, sort) {
    logger.debug(colName + " finding : " + JSON.stringify(query));
    var _skip = skip || 0;
    var _limit = limit || 1000;
    var _sort = sort || {
        _id: -1
    };
    var deferred = Q.defer();
    var collection = connection.collection(colName);
    // if there are a projection, use it
    var cursor = proj ? collection.find(query, proj) : cursor = collection.find(query);
    // configures the query and executes toArray
    cursor
        .skip(_skip)
        .limit(_limit)
        .sort(_sort)
        .toArray(function (err, result) {
            // query executed
            convert.cllbck2prom(err, result, deferred);
        });
    return deferred.promise;
}

function findingOne(colName, query, projection) {
    logger.debug(colName + " findingOne : " + JSON.stringify(query));
    var deferred = Q.defer();
    var collection = connection.collection(colName);
    if (projection) {
        collection.findOne(query, projection, function (err, result) {
            convert.cllbck2prom(err, result, deferred);
        });
    } else {
        collection.findOne(query, function (err, result) {
            convert.cllbck2prom(err, result, deferred);
        });
    }
    return deferred.promise;
}


function aggregating(colName, query) {
    var deferred = Q.defer();
    connection.collection(colName)
        .aggregate(query, function (err, result) {
            convert.cllbck2prom(err, result, deferred);
        });
    return deferred.promise;
}

function inserting(colName, document) {
    logger.debug(colName + " inserting : " + JSON.stringify(document));
    var deferred = Q.defer();
    var writeConcern = {w:1};
    connection.collection(colName)
        .insert(document, writeConcern, function (err, result) {
            convert.cllbck2prom(err, document, deferred);
        });
    return deferred.promise;
}

function updating(colName, query, updateComand, options) {
    logger.debug(colName + " updating : " + JSON.stringify(query) + JSON.stringify(updateComand));
    var deferred = Q.defer();
    connection.collection(colName)
        .update(query, updateComand, options, function (err, result) {
            convert.cllbck2prom(err, updateComand, deferred);
        });
    return deferred.promise;
}

function removing(colName, query, options) {
    logger.debug(colName + " removing : " + JSON.stringify(query));
    var deferred = Q.defer();
    connection.collection(colName)
        .remove(query, options , function (err, result) {
            convert.cllbck2prom(err, result, deferred);
        });
    return deferred.promise;
}

function counting(colName) {
    logger.debug(colName + " counting : " + colName);
    var deferred = Q.defer();
    connection.collection(colName)
        .count(function (err, result) {
            convert.cllbck2prom(err, result, deferred);
        });
    return deferred.promise;
}