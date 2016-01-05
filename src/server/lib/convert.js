var logger = require('./logger.js');


/** conversion utitlity functions */
module.exports = {
		/** promise to response */
		prom2res: promise2response,
		/** request to mongo query */
		req2mongo: request2mongoq,
		/** takes callback parameters and returns a promise response */
		cllbck2prom: callback2Promise,
		/** logs and sends error messages to clients */
		resError: resError
	}
	/** gets a promise and returns a response with status */
function promise2response(prom, res, statusOk, single) {
	prom
		.then(function response(result) {
			if (typeof result == "undefined" || result == null) {
				logger.warn("no result found ");
				res.status(404).json();
			} else if (Array.isArray(result) && result.length <= 0) {
				logger.debug("result: ", JSON.stringify(result));
				res.status(404).json(result);
			} else {
				if (single && Array.isArray(result) && result.length > 0) result = result[0];
				logger.debug("result: ", JSON.stringify(result));
				res.status(statusOk).json(result);
			}
		})
		.fail(function error(err) {
			if (err.code === 11000) {
				logger.warn(err);
				res.status(409).send(err);
			} else {
				logger.error(err);
				res.status(500).send(err);
			}
		});
}


/** given a request, parses its parameters and creates a mongodb query */
function request2mongoq(req) {
	var mongoQuery = {}

	// coll/:id
	if (req.params.id) {
		mongoQuery.query = {
			_id: req.params.id
		};
	}

	// coll/?search=text
	if (req.query.search) {
		var regexOperator = {
			$regex: ".*" + req.query.search + ".*",
			$options: 'i'
		}
		mongoQuery.search = regexOperator;
	}

	// coll/?skip=1&limit=1000
	mongoQuery.skip = parseInt(req.query.skip) || 0;
	mongoQuery.limit = parseInt(req.query.limit) || 10;

	// coll/?sort=field:-field2:field3
	if (req.query.sort) {
		mongoQuery.sort = {};
		var sortFields = req.query.sort.split(":");
		sortFields.forEach(function (sortField) {
			var filedName = sortField.substring("-");
			mongoQuery.sort[filedName] = sortField.indexOf("-") < 0 ? 1 : -1
		})
	}

	// coll/?q=field:value
	if (req.query.q) {
		mongoQuery.query = {};
		if (req.query.q instanceof Array) {
			req.query.q.forEach(function (queryField) {
				parseQueryField(queryField);
			})
		} else {
			parseQueryField(req.query.q);
		}

		function parseQueryField(queryField) {
			var queryPairs = queryField.split(":");
			mongoQuery.query[queryPairs[0]] = queryPairs[1];
		}
	}

	return mongoQuery;
}

/** transforms a callback style code into a more readable promise */
function callback2Promise(err, result, deferred) {
	if (err) {
		logger.error(err);
		deferred.reject(err);
	} else {
		deferred.resolve(result);
	}
}

/** logs and sends error messages to clients */
function resError(err, res, code) {
	var status = code || 500;
	logger.error(err);
	res.status(status).send(err);
}
