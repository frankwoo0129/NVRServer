/*jslint node: true */
"use strict";

var express = require('express');
var list = require('./list');
var admin = require('./admin');
var monitor = require('./monitor');
var video = require('./video');
var jpeg = require('./jpeg');
var lib = require('./lib');
var cameras = require('../lib/controller').cameras;
var root = express.Router();

root.use('/lib', lib);
root.use('/admin', admin);
root.use('/list', list);

root.use('/:address', function (req, res, next) {
	if (cameras[req.params.address]) {
		req.CameraAddress = req.params.address;
		next();
    } else {
		res.status(404).json({msg: 'no ipcamera, address=' + req.params.address});
    }
});

root.use('/:address/monitor', monitor);
root.use('/:address/video', video);
root.use('/:address/jpeg', jpeg);

module.exports = root;
