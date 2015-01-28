/*jslint node: true */
/*jslint nomen: true */
"use strict";

var express = require('express');
var cameras = require('../lib/controller').cameras;

var root = express.Router();
var open = function (address) {
	var camera = cameras[address];
	if (camera) {
		camera.open();
		return null;
	} else {
		return {
			code: 404,
			msg: 'No camera, address=' + address
		};
	}
};

var close = function (address) {
	var camera = cameras[address];
	if (camera) {
		camera.close();
		return null;
	} else {
		return {
			code: 404,
			msg: 'No camera, address=' + address
		};
	}
};

root.post('/:address/start', function (req, res) {
	open(req.params.address);
});

root.post('/:address/stop', function (req, res) {
	close(req.params.address);
});

root.put('/:address', function (req, res) {});

root.del('/:address', function (req, res) {});

root.get('/:address', function (req, res) {});
