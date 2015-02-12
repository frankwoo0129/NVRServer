/*jslint node: true */
/*jslint nomen: true */
"use strict";

var config = require('./config'),
	controller = require('./lib/controller'),
	express = require('express'),
	hbs = require('hbs'),
	server;

var app = express();
var	route = require('./route')(app);
app.set('view engine', 'html');
app.engine('html', hbs.__express);

var startup = function () {
	controller.load();
	controller.start();
	server = app.listen(config.option.port);
};

var shutdown = function () {
	controller.stop();
	if (server) {
		server.close();
	}
	process.exit();
};

process.on('SIGINT', function () {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
	shutdown();
});

startup();
