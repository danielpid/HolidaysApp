var logger = require('../../../logger.js');
var convert = require('../../../convert.js');
var ZSchema = require("z-schema");
var validator = new ZSchema({});

module.exports = crudRouter;

/** a geeneric router for CRUD operations */
function crudRouter(router, data, schema) {
	var crud = data.crud;
	router
		.get('/', function (req, res) {
			getCrud(req, res, crud);
		})
		.get('/:id', function (req, res) {
			getCrud(req, res, crud, true);
		})
		.post('/', function (req, res) {
			postCrud(req, res, crud, schema);
		})
		.put('/:id', function (req, res) {
			putCrud(req, res, crud, schema);
		})
		.delete('/:id', function (req, res) {
			deleteCrud(req, res, crud);
		});
	return router;
}

function getCrud(req, res, crud, single) {
	var mongoQuery = convert.req2mongo(req);
	var promise = crud.finding(mongoQuery);
	convert.prom2res(promise, res, 200, single);
}

function postCrud(req, res, crud, schema) {
	if (!schema || validator.validate(req.body, schema)) {
		var promise = crud.inserting(req.body);
		convert.prom2res(promise, res, 201);
	} else {
		convert.resError(validator.getLastError(), res, 400);
	}
}

function putCrud(req, res, crud, schema) {
	if (!schema || validator.validate(req.body, schema)) {
		var promise = crud.updating(req.params.id, req.body);
		convert.prom2res(promise, res, 200);
	} else {
		convert.resError(validator.getLastError(), res, 400);
	}
}

function deleteCrud(req, res, crud) {
	var promise = crud.removing(req.params.id);
	convert.prom2res(promise, res, 204);
}
