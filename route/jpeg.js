/*jslint node: true */
/*jslint nomen: true */
/*jslint es5: true */
"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
var cameras = require('../lib/controller').cameras;
var option = require('../config/option');
var storage = require('../config/' + option.site + '/storage');

var root = express.Router();

root.get('/:address', function (req, res, next) {
	console.log('http://' + req.socket.localAddress + ':' + req.socket.localPort + req.url);
	if (cameras[req.params.address]) {
		next();
    } else {
		res.status(404).json({msg: 'no ipcamera, address=' + req.params.address});
    }
});
	
root.use(express.static(path.join(__dirname, '../', storage.jpegpath)));

module.exports = root;
