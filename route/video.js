/*jslint node: true */
/*jslint nomen: true */
/*jslint es5: true */
"use strict";

var path = require('path');
var express = require('express');
var log = require('loglevel');
var underscore = require('underscore');
var option = require('../config/option');
var storage = require('../config/' + option.site + '/storage');
var cameras = require('../lib/controller').cameras;

var root = express.Router();

root.get('/:address/*', function (req, res, next) {
	if (cameras[req.params.address]) {
		next();
    } else {
		res.status(404).json({msg: 'no ipcamera, address=' + req.params.address});
    }
});

root.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://' + req.socket.localAddress + ':' + req.socket.localPort);
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

underscore.each(storage.storage, function (config, address) {
	log.debug(path.join(__dirname, '../', storage.videopath, config.path));
	root.use(express.static(path.join(__dirname, '../', storage.videopath, config.path)));
});

module.exports = root;
