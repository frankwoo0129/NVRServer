var option = require('./config/option');
var log = require('loglevel');
log.setLevel(option.loglevel);

var controller = require('./lib/controller');
var http = require('http');
var express = require('express');
var app = express();
var route = require('./route')(app);

contorller.load();
controller.start();
var server = app.listen(3000);


process.on('SIGINT', function() {
	console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
	controller.stop();
	server.close();
	process.exit();
});
