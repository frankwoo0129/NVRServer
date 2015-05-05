/*jslint node: true */
"use strict";

var spawn = require('child_process').spawn;
var fs = require('fs');
var mkdirp = require('mkdirp');
var log = require('loglevel');
var EventEmitter = require('events').EventEmitter;
var EventProxy = require('eventproxy');
var retry = 300;
var STATUS = {
	isRunning: 1,
	stopped: 0,
	isStarting: -1
};

var executor = function (address) {
	this.address = address;
	this.title = undefined;
	this.stream = undefined;
	this.videopath = undefined;
	this.jpegpath = undefined;

	var self = this,
		event = new EventEmitter(),
		ffmpeg,
		status = STATUS.stopped,
		errorMsg = false;

	this.open = function () {
		status = STATUS.isStarting;
		
		if (ffmpeg && ffmpeg !== null) {
			ffmpeg.kill();
			ffmpeg = null;
		}
		
		event.emit('start');
	};

	this.close = function (callback) {
		status = STATUS.stopped;
		
		if (ffmpeg && ffmpeg !== null) {
			ffmpeg.kill();
			ffmpeg = null;
		}
		
		if (callback && typeof callback === 'function') {
			callback();
		}
		
		event.emit('end');
	};

	event.on('start', function () {
		if (status === STATUS.stopped) {
			return;
		}
		var check = new EventProxy(),
			inputcommand = [
				'-y',
				'-re',
				'-rtsp_transport', 'tcp',
				'-i', self.stream,
				'-loglevel', 'error'],
			videocommand = [
				'-map', 0,
				'-vcodec', 'copy',
				'-an',
				'-f', 'segment',
				'-segment_time', 2,
				'-segment_list_size', 2,
				'-segment_list', self.videopath + '/out.m3u8',
				'-strftime', 1,
				self.videopath + '/%Y%m%d%H%M%S.ts'],
			jpegcommand = [
				'-map', 0,
				'-r', 1,
				'-f', 'image2',
				'-strftime', 1,
				self.jpegpath + '/%M%S.jpg'];
		
		check.all('onVideoDir', 'onJPEGDir', function (video, jpeg) {
			if (!video) {
				throw new Error('videodir error, ' + self.videopath);
			} else if (!jpeg) {
				throw new Error('jpegdir error, ' + self.jpegpath);
			} else {
				ffmpeg = spawn('ffmpeg', inputcommand.concat(videocommand).concat(jpegcommand));
				ffmpeg.stderr.on('data', function (data) {
					errorMsg = true;
					setTimeout(function () {
						errorMsg = false;
					}, 10000);
					log.warn(' ' + data);
				});
				ffmpeg.on('exit', function (code, signal) {
					if (status !== STATUS.stopped) {
						status = STATUS.isStarting;
					}
					event.emit('end');
				});
				status = STATUS.isRunning;
			}
		});
		
		function checkDirectory(path, event) {
			fs.exists(path, function (exists) {
				if (!exists) {
					mkdirp(path, function (err) {
						if (err) {
							check.emit(event, false);
						} else {
							check.emit(event, true);
						}
					});
				} else {
					check.emit(event, true);
				}
			});
		}
		
		checkDirectory(self.videopath, 'onVideoDir');
		checkDirectory(self.jpegpath, 'onJPEGDir');
	});

	event.on('end', function () {
		if (status !== STATUS.stopped) {
			setTimeout(function () {
				event.emit('start');
			}, retry);
		}
	});
};

module.exports = executor;
