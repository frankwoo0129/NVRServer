/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var underscore = require('underscore');
var mkdirp = require('mkdirp');
var log = require('loglevel');
var option = require('./option');
var model = require('./model');
log.setLevel(option.loglevel);

var storage = JSON.parse(fs.readFileSync('./config/' + option.site + '/storage.json', {encoding: 'utf-8'}));
var config = JSON.parse(fs.readFileSync('./config/' + option.site + '/camera.json', {encoding: 'utf-8'}));

if (!storage.jpegpath) {
	throw new Error('No jpegpath');
} else if (!storage.videopath) {
	throw new Error('No videopath');
} else {
	mkdirp(storage.jpegpath, function (err) {
		if (err) {
			throw new Error('mkdir jpegpath error');
		} else {
			log.debug('mkdir: ' + fs.realpathSync(storage.jpegpath));
		}
	});
	
	mkdirp(storage.videopath, function (err) {
		if (err) {
			throw new Error('mkdir videopath error');
		} else {
			log.debug('mkdir: ' + fs.realpathSync(storage.videopath));
		}
	});
	
	underscore.each(storage.storage, function (value, key) {
		mkdirp(path.join(storage.videopath, value.path), function (err) {
			if (err) {
				throw new Error('mkdir videopath error');
			} else {
				log.debug('mkdir: ' + fs.realpathSync(path.join(storage.videopath, value.path)));
			}
		});
	});
}

module.exports.config = config;
module.exports.storage = storage;
module.exports.option = option;
module.exports.model = model;
