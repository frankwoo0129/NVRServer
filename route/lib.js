var fs = require('fs');
var path = require('path');
var express = require('express');

var root = express.Router();
var router_videojs = express.Router();
var router_videojs_contrib_media_sources = express.Router();
var router_videojs_contrib_hls = express.Router();
var router_pkcs7 = express.Router();

router_videojs.use(
	express.static(path.join(__dirname, '../node_modules/video.js/dist/video-js/')));
router_videojs_contrib_media_sources.use(
	express.static(path.join(__dirname, '../node_modules/videojs-contrib-hls/node_modules/videojs-contrib-media-sources/src/')));
router_videojs_contrib_hls.use(
	express.static(path.join(__dirname, '../node_modules/videojs-contrib-hls/src/')));
router_pkcs7.use(
	express.static(path.join(__dirname, '../node_modules/videojs-contrib-hls/node_modules/pkcs7/dist/')));

root.use('/videojs', router_videojs);
root.use('/videojs-contrib-media-sources', router_videojs_contrib_media_sources);
root.use('/videojs-contrib-hls', router_videojs_contrib_hls);
root.use('/pkcs7', router_pkcs7);
	
module.exports = root;
