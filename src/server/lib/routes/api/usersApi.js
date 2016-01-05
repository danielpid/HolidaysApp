var express = require('express');
var crudApi = require('./util/crudApi.js');
var usersData = require('../../data/usersData.js');
var convert = require('../../convert.js');
var logger = require('../../logger.js');
var jwt = require('../../jwt.js');

/** a new router */
var router = express.Router({
    mergeParams: true
});

/** valdation schema for users */
var schema = {
    id: "rolesDetails",
    type: "object",
    properties: {
        _id: {
            type: "string"
        },
        name: {
            type: "string"
        },
        password: {
            type: "string"
        },
        email: {
            type: "string"
        }
    },
    required: ["_id", "name", "password", "email"]
}

/** custom implementations for /users route */
router
    .post('/', function (req, res) {
        registerNewUser(req, res);
    })
    .get('/', function (req, res) {
        jwt.verify(req, res);
        convert.prom2res(usersData.findingByEmail(req.user.email), res, 200);
    })
    .put('/:id', function (req, res) {
        jwt.verify(req, res);
        convert.prom2res(usersData.crud.updating(req.params.id, req.body), res, 200);
    })
    .delete('/:id', function (req, res) {
        jwt.verify(req, res);
        convert.prom2res(usersData.removing(req.params.id, req.body), res, 200);
        //convert.prom2res(usersData.crud.updating(req.params.id, req.body), res, 200);
    });


/** custom implementations for /users/sessions route */
router.post('/sessions', function (req, res) {
    usersData.findingByEmailPassword(req.body.email, req.body.password)
        .then(function (user) {
            checkNewSession(user, res);
        })
        .fail(function (err) {
            convert.resError(err, res);
        });

});

function registerNewUser(req, res) {
    usersData.findingByEmail(req.body.email)
        .then(function (user) {
            if (user) {
                return res.status(409).send(); // conflict
            } else {
                insertNewUser(req, res);
            }
        })
        .fail(function (err) {
            convert.resError(err, res);
        });
}

function insertNewUser(req, res) {
    var user = req.body;
    usersData.crud.counting()
        .then(function (count) {
            if (count == 0) user.role = "GOD";
            usersData.crud.inserting(user)
                .then(function (user) {
                    return jwt.generate(JSON.stringify(user), res);
                })
                .fail(function (err) {
                    convert.resError(err, res);
                });
        })
        .fail(function (err) {
            convert.resError(err, res);
        });
}

function checkNewSession(user, res) {
    if (user) {
        return jwt.generate(JSON.stringify(user), res);
    } else {
        convert.resError({
            error: "Invalid email or password"
        }, res,401);
    }
}

/** generic implementation of crud operations for other non managed routes */
crudApi(router, usersData, schema);


/** the router with custom logic on each route */
module.exports = router;