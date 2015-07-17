/*jslint node: true */
"use strict";

var spawn = require('child_process').spawn;
var fs = require('fs');
var mkdirp = require('mkdirp');
var log = require('loglevel');
var EventEmitter = require('events').EventEmitter;
var EventProxy = require('eventproxy');
var ffmpeg = require('fluent-ffmpeg');
var retry = 300;

var executor = function (address) {
	this.address = address;
	this.title = undefined;
	this.stream = undefined;
	this.videopath = undefined;
	this.jpegpath = undefined;
	this.isClosed = true;

	var self = this,
		command;

	this.open = function () {
		this.isClosed = false;
		var check = new EventProxy();
		check.all('onVideoDir', 'onJPEGDir', function (video, jpeg) {
			if (!video) {
				throw new Error('videodir error, ' + self.videopath);
			} else if (!jpeg) {
				throw new Error('jpegdir error, ' + self.jpegpath);
			} else {
				command.run();
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

		command = ffmpeg(self.stream).inputOption('-re').inputOption('-y').inputOption('-rtsp_transport tcp').videoCodec('copy').noAudio()
			.output(self.videopath + '/%Y%m%d%H%M%S.ts').format('segment').addOutputOptions([
				'-segment_time 60',
				'-strftime 1'])
			.output(self.videopath + '/%H%M%S.ts').format('segment').addOutputOptions([
				'-segment_time 2',
				'-segment_list_size 2',
				'-segment_list_flags +live',
				'-segment_list ' + self.videopath + '/now.m3u8',
				'-strftime 1'])
			.output(self.jpegpath + '/%M%S.jpg').fps(2).format('image2').addOutputOptions([
				'-strftime 1'])
			.on('error', function (err) {
				console.log(self.title + ' occur error: ' + err.message);
				if (!self.isClosed) {
					command.run();
				}
			}).on('end', function () {
				if (self.isClosed) {
					console.log(self.title + ' is closed');
				} else {
					command.run();
				}
			});
	};

	this.close = function (callback) {
		this.isClosed = true;
		if (command) {
			command.kill('SIGINT');
			command = undefined;
		}
		if (callback && typeof callback === 'function') {
			callback();
		}
	};
};

module.exports = executor;
