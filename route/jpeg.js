/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
var moment = require('moment');
var cameras = require('../lib/controller').cameras;
var root = express.Router();

root.get('/', function (req, res) {
	res.sendFile(path.join(cameras[req.CameraAddress].jpegpath, moment().subtract(3, 's').format('mmss') + '.jpg'), {root: '/'});
});

module.exports = root;
