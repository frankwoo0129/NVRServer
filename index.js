/*jslint node: true */
/*jslint nomen: true */
"use strict";

var config = require('./config'),
	controller = require('./lib/controller'),
	express = require('express'),
	hbs = require('hbs'),
	route = require('./route'),
	app = express(),
	server;

app.use(route);
app.set('view engine', 'html');
app.engine('html', hbs.__express);

var startup = function () {
	controller.load();
	controller.start();
	server = app.listen(config.option.port);
};

var shutdown = function (callback) {
	try {
		controller.stop();
		server.close();
	} finally {
		if (typeof callback === 'function') {
			callback();
		}
	}
};

process.on('SIGINT', function () {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
	shutdown(function () {
		process.exit();
	});
});

startup();
