/*jslint node: true */
/*jslint nomen: true */
/*jslint es5: true */
"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
var moment = require('moment');
var cameras = require('../lib/controller').cameras;
var storage = require('../config/').storage;
var root = express.Router();

root.get('/:address', function (req, res) {
	if (cameras[req.params.address]) {
		res.sendFile(path.join(fs.realpathSync(storage.jpegpath), req.params.address, moment().subtract(3, 's').format('mmss') + '.jpg'), {root: '/'});
    } else {
		res.status(404).json({msg: 'no ipcamera, address=' + req.params.address});
    }
});

module.exports = root;
