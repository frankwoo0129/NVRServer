/*jslint node: true */
/*jslint nomen: true */
"use strict";

var list = require('./list');
var admin = require('./admin');
var monitor = require('./monitor');
var video = require('./video');
var jpeg = require('./jpeg');
var lib = require('./lib');

module.exports = function (app) {
    app.use('/admin', admin);
    app.use('/list', list);
	app.use('/monitor', monitor);
	app.use('/video', video);
	app.use('/jpeg', jpeg);
	app.use('/lib', lib);
    
    app.all('*', function (req, res) {
        res.sendStatus(404);
    });
};
