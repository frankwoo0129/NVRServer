/*jslint node: true */
/*jslint nomen: true */
/*jslint es5: true */
"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');

var root = express.Router();
root.use('/jquery', express.Router().use(express.static(path.join(__dirname, '../bower_components/jquery/'))));
root.use('/videojs', express.Router().use(express.static(path.join(__dirname, '../bower_components/videojs/dist/video-js/'))));
root.use('/videojs-contrib-media-sources', express.Router().use(express.static(path.join(__dirname, '../bower_components/videojs-contrib-media-sources/src/'))));
root.use('/videojs-contrib-hls', express.Router().use(express.static(path.join(__dirname, '../bower_components/videojs-contrib-hls/src/'))));
root.use('/pkcs7', express.Router().use(express.static(path.join(__dirname, '../bower_components/videojs-contrib-hls/node_modules/pkcs7/dist/'))));
root.use('/requirejs', express.Router().use(express.static(path.join(__dirname, '../node_modules/requirejs/'))));
	
module.exports = root;
