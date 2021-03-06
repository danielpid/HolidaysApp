var ObjectID = require('mongodb').ObjectID;
var mongodb = require('./mongodb.js');

/** factory that returns a generic crud implementations with mongo */
module.exports.crud = function (colname, sort, limit, hasObjectId) {
    /** object for perform basic crud actions in a collection */
    return {
        /** the collection name */
        _colName: colname,
        /** sort order, defaults to _id desc */
        _sort: sort || {
            _id: -1
        },
        /** num docs per query, defaults to 100 */
        _limit: limit || 100,
        /** flag to ise ObjectID with the _id key */
        _oID: hasObjectId || true,
        /** utitlilty to perform basic finding queries */
        finding: finding,
        /** utitlilty to perform basic inserting operations */
        inserting: inserting,
        /** utitlilty to perform basic updating operations */
        updating: updating,
        /** utitlilty to perform basic removing operations */
        removing: removing,
        /** utitlilty to perform a count query */
        counting: counting
    };
}

function finding(mongoQ) {
    return mongodb.finding(
        this._colName, 
        forceId(mongoQ.query, this._oID), 
        null, 
        mongoQ.skip, 
        mongoQ.limit || this._limit, 
        mongoQ.sort || this._sort);
}

function inserting(document) {
    return mongodb.inserting(this._colName, document);
}

function updating(id, document) {
    return mongodb.updating(
        this._colName, 
        forceId(
            { _id: id }, 
            this._oID), 
        forceId(
            document, 
            this._oID), 
        null);
}

function removing(id, document) {
    return mongodb.removing(
        this._colName, 
        forceId(
            { _id: id }, 
            this._oID), 
        null);
}

function counting() {
    return mongodb.counting(this._colName);
}


/** the autogenerated _id properties are custom mongo objects */
function forceId(document, hasObjectID) {
    if (document && document._id && hasObjectID) {
        document._id = new ObjectID(document._id);
    }
    return document;
}