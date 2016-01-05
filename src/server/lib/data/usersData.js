var colName = 'users';
var Q = require('q');
var convert = require('../convert.js');
var crudData = require('./util/crudData.js');

var mongodb = require('./util/mongodb.js');
/** configures the generic data layer, with a collection name and default sorting by _id */
var crud = crudData.crud(colName, { _id: 1 });


/** custom implementation to find users by email */
exports.findingByEmail = function (email) {
    return mongodb.findingOne(colName, { email: email }, null);
}

/** custom implementation to find users by email and password*/
exports.findingByEmailPassword = function (email,password) {
    return mongodb.findingOne(colName, { email: email, password:password}, null);
}


exports.crud = crud;

