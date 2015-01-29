/*jslint node: true */
/*jslint nomen: true */
"use strict";

var express = require('express');
var hbs = require('hbs');

var list = require('./list');
var admin = require('./admin');
var monitor = require('./monitor');
var video = require('./video');
var lib = require('./lib');

module.exports = function (app) {
	app.set('view engine', 'html');
	app.engine('html', hbs.__express);

    app.use('/admin', admin);
    app.use('/list', list);
	app.use('/monitor', monitor);
	app.use('/video', video);
	app.use('/lib', lib);
    
    app.all('*', function (req, res) {
        res.sendStatus(404);
    });
};
