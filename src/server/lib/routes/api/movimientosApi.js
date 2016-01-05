var express = require('express');
var crudApi = require('./util/crudApi.js');
var data = require('../../data/movimientosData.js');

/** a new router */
var router = express.Router({
    mergeParams: true
});

/** valdation schema for roles */
/*var schema = {
        id: "rolesDetails",
        type: "object",
        properties: {
            _id: { type: "string" }
        },
        required: ["_id"]
}*/

/** generic implementation of crud operations */
crudApi(router,data, null);

/** the router with custom logic on each route */
module.exports = router;