/*jslint node: true */
/*jslint nomen: true */
"use strict";

var express = require('express');
var list = require('./list');
var admin = require('./admin');
var monitor = require('./monitor');
var video = require('./video');
var jpeg = require('./jpeg');
var lib = require('./lib');
var root = express.Router();

root.use('/lib', lib);
root.use('/admin', admin);
root.use('/list', list);
root.use('/monitor', monitor);
root.use('/video', video);
root.use('/jpeg', jpeg);

root.all('*', function (req, res) {
	res.sendStatus(404);
});

module.exports = root;
