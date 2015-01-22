var fs = require('fs');
var path = require('path');
var express = require('express');
var hbs = require('hbs');

var monitor = require('./monitor');
var video = require('./video');
var lib = require('./lib');

module.exports = function(app) {
	app.set('view engine', 'html');
	app.engine('html', hbs.__express);

	app.use('/monitor', monitor);
	app.use('/video', video);
	app.use('/lib', lib);

	app.use(express.static(path.join(__dirname, '../dist')));
};
