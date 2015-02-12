/*jslint node: true */
/*jslint nomen: true */
/*jslint es5: true */
"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
var cameras = require('../lib/controller').cameras;
var storage = require('../config').storage;

var root = express.Router();

root.get('/:address', function (req, res) {
	res.render('example', {
		cameraAddress: req.params.address,
		localAddress: req.socket.localAddress,
		localPort: req.socket.localPort
	});
});

root.get('/:address/*', function (req, res, next) {
	console.log(req.url);
	if (cameras[req.params.address]) {
		next();
    } else {
		res.status(404).json({msg: 'no ipcamera, address=' + req.params.address});
    }
});

root.get(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:1234');
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
	
root.use(express.static(fs.realpathSync(storage.temp)));

module.exports = root;
