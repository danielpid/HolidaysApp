var colName = 'movimientos';
var crudData = require('./util/crudData.js');

/** configures the generic data layer, with a collection name and default sorting by _id */
var crud = crudData.crud(colName,{ fecha : -1 },100,true);

exports.crud = crud;