/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
var log = require('loglevel');
var cameras = require('../lib/controller').cameras;
var root = express.Router();

root.get('/', function (req, res) {
	var localAddress = req.socket.localAddress.split(':');
	res.render('example', {
		cameraAddress: req.CameraAddress,
		localAddress: localAddress[localAddress.length - 1],
		localPort: req.socket.localPort
	});
});

root.use(function (req, res, next) {
	if (req.headers.origin) {
		res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
	}
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

root.get('/*', function (req, res, next) {
	console.log(req.originalUrl);
	var filepath = path.join(fs.realpathSync(cameras[req.CameraAddress].videopath), req.params[0]);
	fs.stat(filepath, function (err, stat) {
		if (err) {
			res.sendStatus(404);
		} else if (stat.size !== 0) {
			res.sendFile(filepath);
		} else {
			res.sendStatus(404);
		}
	});
});

module.exports = root;
