var express = require('express');
var crudApi = require('./util/crudApi.js');
var data = require('../../data/provincesData.js');

/** a new router */
var router = express.Router({
    mergeParams: true
});


/** generic implementation of crud operations */
crudApi(router, data, null);

/** the router with custom logic on each route */
module.exports = router;