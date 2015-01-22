var option = require('./config/option');
var controller = require('./lib/controller');
var express = require('express');
var app = express();
var route = require('./route')(app);

controller.load();
controller.start();
var server = app.listen(option.port);

process.on('SIGINT', function() {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
	controller.stop();
	server.close();
	process.exit();
});
