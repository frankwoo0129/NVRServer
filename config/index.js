/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var underscore = require('underscore');
var mkdirp = require('mkdirp');
var async = require('async');
var log = require('loglevel');
var option = require('./option');
var model = require('./model');
log.setLevel(option.loglevel);

var storage = JSON.parse(fs.readFileSync('./config/' + option.site + '/storage.json', {encoding: 'utf-8'}));
var config = JSON.parse(fs.readFileSync('./config/' + option.site + '/camera.json', {encoding: 'utf-8'}));

var mk = function (p, callback) {
	mkdirp(p, function (err) {
		if (err) {
			callback(new Error('mkdir ' + p + ' error'));
		} else {
			log.debug('mkdir: ' + fs.realpathSync(p));
			callback();
		}
	});
};

if (!storage.jpegpath) {
	throw new Error('No jpegpath');
} else if (!storage.videopath) {
	throw new Error('No videopath');
} else {
	async.series([
		function (callback) {
			async.each([storage.jpegpath, storage.videopath], mk, function (err) {
				if (err) {
					throw err;
				}
			});
		}, function (callback) {
			async.forEachOf(storage.storage, function (value, key, callback) {
				var p = path.join(storage.videopath, value.path);
				mk(p, callback);
			}, function (err) {
				if (err) {
					throw err;
				}
			});
		}
	]);
}

module.exports.config = config;
module.exports.storage = storage;
module.exports.option = option;
module.exports.model = model;
