var express = require('express');
var crudApi = require('./util/crudApi.js');
var rolesData = require('../../data/rolesData.js');

/** a new router */
var router = express.Router({
    mergeParams: true
});

/** valdation schema for roles */
var schema = {
        id: "rolesDetails",
        type: "object",
        properties: {
            _id: { type: "string" },
            name: { type: "string" }
        },
        required: ["_id", "name"]
}

/** generic implementation of crud operations */
crudApi(router,rolesData, schema);

/** the router with custom logic on each route */
module.exports = router;