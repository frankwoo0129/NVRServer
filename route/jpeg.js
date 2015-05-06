/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
var moment = require('moment');
var cameras = require('../lib/controller').cameras;
var root = express.Router();

var getPicture = function (address, count, callback) {
	var filepath = path.join(cameras[address].jpegpath, moment().subtract(3, 's').format('mmss') + '.jpg');
	fs.stat(filepath, function (err, stat) {
		if (err) {
			callback(count + 1);
		} else if (moment().diff(moment(stat.mtime), 'minutes') > 1) {
			callback(count + 1);
		} else if (stat.size === 0) {
			callback(count + 1);
		} else if (count > 10) {
			callback(-1);
		} else {
			callback(null, filepath);
		}
	});
};

root.get('/', function (req, res) {
	var callback = function (count, filepath) {
		if (!count) {
			res.sendFile(fs.realpathSync(filepath), {root: '/'});
		} else if (count >= 0) {
			getPicture(req.CameraAddress, count, callback);
		} else {
			res.sendStatus(404);
		}
	};
	
	getPicture(req.CameraAddress, 0, callback);
});


module.exports = root;
