var mongodb = require('./data/util/mongodb.js');
var logger = require('./logger.js');

var colName = 'metrics';


/** to count how many times an event has ocurred */
module.exports.count = function(key) {  
    saveMetric(key, 0);
};
/** to sum a quantity to a category event */
module.exports.sum = function (key, quantity) {
    saveMetric(key, quantity);
};

/** inserts or updates a metric key */
function saveMetric(key, quantity) {
    var query = { _id: key };
    mongodb.finding(colName, query, null)
        .then(function (item) {
            if (!item || item.length==0) {
                newMetric(query, quantity);
            } else {
                updateMetric(query, quantity);
            }
        });
};
/** creates a new entry for new event category */
function newMetric(query, value) {
    var metric = {
        _id: query._id,
        first: new Date(),
        last: new Date(),
        counter: 1,
        sum: value
    };
    mongodb.inserting(colName,metric);
}

/** updates a metric for an existing event category */
function updateMetric(query, value) {
    var updt = {
        $inc: { counter: 1, sum: value },
        $set: { last: new Date() }
    };
    mongodb.updating(colName, query, updt, null);
}















