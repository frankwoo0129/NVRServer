/*jslint node: true */
/*jslint nomen: true */
"use strict";

var spawn = require('child_process').spawn;
var fs = require('fs');
var mkdirp = require('mkdirp');
var log = require('loglevel');
var EventEmitter = require('events').EventEmitter;
var EventProxy = require('eventproxy');
var option = require('../config/option');

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
	this.monitorpath = undefined;
	
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
	};

	event.on('start', function () {
		if (status === STATUS.stopped) {
			return;
        }

		var inputcommand = [
            '-rtsp_transport', 'tcp',
			'-y',
			'-i', self.stream,
			'-loglevel', 'error'
        ], videocommand = [
            '-map', 0,
            '-vcodec', 'copy',
			'-an',
			'-f', 'segment',
			'-segment_time', 60,
			'-strftime', 1,
			self.videopath + '/%Y%m%d%H%M%S.ts'
        ], monitorcommand = [
			//'-bsf:v', 'h264_mp4toannexb',
			//'-r', 5,
			//'-vcodec', 'libx264',
			'-map', 0,
			'-vcodec', 'copy',
			'-an',
			//'-flags', '-global_header',
			'-f', 'segment',
			//'-segment_format', 'mpegts',
			'-segment_time', 2,
			'-segment_list_size', 2,
			'-segment_list', self.monitorpath + '/out.m3u8',
			'-strftime', 1,
			self.monitorpath + '/%M%S.ts'
        ], check = new EventProxy();
        
		check.all('onVideoDir', 'onJPEGDir', 'onTempDir', function (video, jpeg, temp) {
			if (!video) {
				throw new Error('videodir error, ' + self.videopath);
			} else if (!jpeg) {
				throw new Error('jpegdir error, ' + self.jpegpath);
			} else if (!temp) {
				throw new Error('monitordir error, ' + self.monitorpath);
			} else {
				ffmpeg = spawn('ffmpeg', inputcommand.concat(videocommand).concat(monitorcommand));
				var timeout = setTimeout(function () {
					status = STATUS.isRunning;
				}, 1000);
				ffmpeg.stderr.on('data', function (data) {
					errorMsg = true;
					setTimeout(function () {
						errorMsg = false;
					}, 10000);
					log.warn(' ' + data);
				});
				ffmpeg.on('exit', function (code, signal) {
					clearTimeout(timeout);
					if (status !== STATUS.stopped) {
						status = STATUS.isStarting;
                    }
					event.emit('end');
				});
			}
		});

		fs.exists(self.videopath, function (exists) {
			if (!exists) {
				mkdirp(self.videopath, function (err) {
					if (err) {
						log.debug('onVideoDir Error, ' + err);
						check.emit('onVideoDir', false);
					} else {
						check.emit('onVideoDir', true);
                    }
				});
            } else {
				check.emit('onVideoDir', true);
            }
		});
        
		fs.exists(self.jpegpath, function (exists) {
			if (!exists) {
				mkdirp(self.jpegpath, function (err) {
					if (err) {
						log.debug('onJPEGDir Error, ' + err);
						check.emit('onJPEGDir', false);
					} else {
						check.emit('onJPEGDir', true);
                    }
				});
            } else {
				check.emit('onJPEGDir', true);
            }

		});
		
		fs.exists(self.monitorpath, function (exists) {
			if (!exists) {
				mkdirp(self.monitorpath, function (err) {
					if (err) {
						log.debug('onTempDir Error, ' + err);
						check.emit('onTempDir', false);
					} else {
						check.emit('onTempDir', true);
                    }
				});
            } else {
				check.emit('onTempDir', true);
            }
		});

	});

	event.on('end', function () {
		if (status !== STATUS.stopped) {
			setTimeout(function () {
				event.emit('start');
			}, option.retry);
		}
	});

};

module.exports = executor;
