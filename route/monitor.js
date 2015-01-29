/*jslint node: true */
/*jslint nomen: true */
"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
var cameras = require('../lib/controller').cameras;
var option = require('../config/option');
var storage = require('../config/' + option.site + '/storage');

var root = express.Router();

root.get('/', function (req, res) {
//    if (cameras[req.params.address]) {
		res.render('example', {address: req.params.address});
//    } else {
//		res.status(404).json({msg: 'no ipcamera, address=' + req.params.address});
//    }
});

root.get('/:address/*', function (req, res, next) {
	console.log('http://' + req.socket.localAddress + ':' + req.socket.localPort + req.url);
	if (cameras[req.params.address]) {
		next();
    } else {
		res.status(404).json({msg: 'no ipcamera, address=' + req.params.address});
    }
});

root.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://' + req.socket.localAddress + ':' + 8000);
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});
	
root.use(express.static(path.join(__dirname, '../', storage.temp)));

module.exports = root;
