/*jslint node: true */
/*jslint es5: true */
"use strict";

var express = require('express');
var cameras = require('../lib/controller').cameras;

var root = express.Router();

root.use('/:address/*', function (req, res, next) {
	var address = req.params.address,
		camera = cameras[address];
	if (camera) {
		next();
	} else {
		res.status(404).json({msg: 'No camera, address=' + address});
	}
});

root.post('/:address/start', function (req, res) {
	var address = req.params.address,
		camera = cameras[address];
	if (camera) {
		camera.open();
		req.status(200).json({address: address});
	} else {
		res.status(404).json({msg: 'No camera, address=' + address});
	}
});

root.post('/:address/stop', function (req, res) {
	var address = req.params.address,
		camera = cameras[address];
	if (camera) {
		camera.close(function () {
			res.status(200).json({address: address});
		});
	} else {
		res.status(404).json({msg: 'No camera, address=' + address});
	}
});

root.put('/:address', function (req, res) {});

root.delete('/:address', function (req, res) {});

root.get('/:address', function (req, res) {});

module.exports = root;
