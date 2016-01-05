var colName = 'roles';
var crudData = require('./util/crudData.js');

/** configures the generic data layer, with a collection name and default sorting by _id */
var crud = crudData.crud(colName,{ _id: 1 });

exports.crud = crud;