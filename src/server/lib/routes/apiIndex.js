var express = require('express');

/** routing for api calls */
module.exports.apiRoutes = function (app) {
	app.use('/api/roles', require('./api/rolesApi.js'));
	app.use('/api/users', require('./api/usersApi.js'));
	app.use('/api/movimientos', require('./api/movimientosApi.js'));
	app.use('/api/transactions', require('./api/transactionsApi.js'));
	app.use('/api/provinces', require('./api/provincesApi.js'));
}
