"use strict";

/** Creates and exports the express application*/
exports.createApp = function () {
    var express = require('express');
    var middleware = require('./middleware.js');
    var staticFiles = require('./routes/staticFiles.js')
    var apiIndex = require('./routes/apiIndex.js')
    var other = require('./routes/other.js')
    
    // creataing the express application
    var app = express();
    
    // middleware configuration
    middleware.useExpressLog(app);
    middleware.useCache(app);
    middleware.useCompression(app);
    middleware.useUploader(app);
    middleware.useBodyParser(app);
    middleware.useSecurity(app);
    
    // routes
    staticFiles.staticFileRoutes(app);
    apiIndex.apiRoutes(app);
    other.otherRoutes(app);
    
    return app;
};
