/** start file */
"use strict";

var settings = require("./lib/settings.js");
var mongodb = require("./lib/data/util/mongodb.js");
var logger = require("./lib/logger.js");

/** in a MEAN app, we have to ensure there is a MongoDB  */
mongodb.connecting().then(function (db) {
	mongodb.setConnection(db);
	logger.info('ready... MongoDB ok', settings);
	var metrics = require("./lib/metrics.js");
	metrics.count(settings.name + ".start");
	var express = require('./lib/express.js');
	var app = express.createApp();
	logger.info('steady... express router ok');
	var server = app.listen(settings.port, function () {
		logger.warn('go... listening on port: ' + server.address().port);
	});
}).fail(function (err) {
	console.error(err);
});
