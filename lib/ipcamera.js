/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');
var log = require('loglevel');
var moment = require('moment');
var async = require('async');
var EventProxy = require('eventproxy');
var ffmpeg = require('fluent-ffmpeg');
var model = require('../config').model;

var mkdirpIfNoExist = function (path, callback) {
	fs.exists(path, function (exists) {
		if (!exists) {
			mkdirp(path, function (err) {
				if (err) {
					callback(err);
				} else {
					callback();
				}
			});
		} else {
			callback();
		}
	});
};

function IPCamera(config) {
	if (!(this instanceof IPCamera)) {
		return new IPCamera(config);
	}

	config = config || {};
	if (!config.address) {
		throw new Error('No address supplied to IPCamera');
	}
	if (!config.title) {
		throw new Error('No title supplied to IPCamera');
	}

	this.address = config.address;
	this.title = config.title;
	this.model = config.model;
	this.user = config.user;
	this.passwd = config.passwd;

	if (config.stream) {
		this.stream = config.stream;
	} else if (config.model && model[config.model]) {
		var stream = model[config.model];
		if (!config.user || !config.passwd) {
			this.stream = util.format(stream.replace('%s:%s@%s', '%s'), config.address);
		} else {
			this.stream = util.format(stream, config.user, config.passwd, config.address);
		}
	} else {
		throw new Error('No stream link supplied to IPCamera');
	}

	if (!config.videopath || !config.jpegpath) {
		throw new Error('No storage path');
	} else {
		this.videopath = config.videopath;
		this.jpegpath = config.jpegpath;
	}
}

IPCamera.prototype.open = function (callback) {
	var self = this,
		check = new EventProxy();

	if (self.isStarting) {
		return;
	} else {
		try {
			self.command.kill();
		} catch (err) {
		}
	}

	self.isClosed = false;
	self.command = ffmpeg(self.stream).inputOption('-re').inputOption('-y').inputOption('-rtsp_transport tcp').videoCodec('copy').noAudio()
		.output(self.videopath + '/%H%M%S.ts').format('segment').addOutputOptions([
			'-flags +global_header',
			'-segment_time 2',
			'-segment_list_size 2',
			'-segment_list_flags +live',
			'-segment_list ' + self.videopath + '/now.m3u8',
			'-strftime 1'])
		.output(self.jpegpath + '/%M%S.jpg').fps(2).format('image2').addOutputOptions([
			'-strftime 1'])
		.on('start', function () {
			self.isStarting = true;
		})
		.on('error', function (err) {
			self.isStarting = false;
			log.error('[' + moment().format('YYYYMMDD hh:mm:ss') + ']: ' + self.title + ' occur error: ' + err.message);
			if (!self.isClosed) {
				self.command.run();
			}
		})
		.on('end', function () {
			self.isStarting = false;
			if (self.isClosed) {
				log.info(self.title + ' is closed');
			} else {
				self.command.run();
			}
		});

	async.parallel([
		function (callback) {
			mkdirpIfNoExist(self.videopath, callback);
		},
		function (callback) {
			mkdirpIfNoExist(self.jpegpath, callback);
		}
	], function (err) {
		if (err) {
			callback(err);
		} else {
			self.command.run();
			callback();
		}
	});
};

IPCamera.prototype.close = function () {
	var self = this;
	self.isClosed = true;
	self.isStarting = false;
	if (self.command) {
		self.command.kill();
		self.command = undefined;
	}
};

IPCamera.prototype.screenshot = function (callback) {
	var self = this;
	async.waterfall([
		function (callback) {
			mkdirpIfNoExist(self.jpegpath, callback);
		},
		function (callback) {
			fs.realpath(path.join(self.jpegpath, 'now.jpg'), function (err, realpath) {
				if (err) {
					realpath = err.path;
				}
				ffmpeg(self.stream).inputOption('-y')
					.output(realpath).format('image2').addOutputOptions([
						'-vframes 1'
					])
					.on('error', function (err) {
						callback(err);
					})
					.on('end', function () {
						callback(null, realpath);
					})
					.run();
			});
		}
	], callback);
};

module.exports = IPCamera;
