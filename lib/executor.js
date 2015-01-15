var spawn = require('child_process').spawn;
var fs = require('fs');
var mkdirp = require('mkdirp');
var log = require('loglevel');
var EventEmitter = require('events').EventEmitter;
var EventProxy = require('eventproxy');
var moment = require('moment');
var option = require('../config/option');

var executor = function(address) {
	this.address = address;
	this.title = undefined;
	this.stream = undefined;
	this.videopath = undefined;
	this.jpegpath = undefined;
	
	var self = this;
	var event = new EventEmitter();
	var ffmpeg = undefined;
	var isClosed = true;
	
	this.open = function() {
		if (ffmpeg && ffmpeg != null) {
			ffmpeg.kill();
		} 
		isClosed = false;
		event.emit('start');
	};

	this.close = function() {
		isClosed = true;
		if (ffmpeg && ffmpeg != null) {
			ffmpeg.kill();
			ffmpeg = null;
		}
	};

	event.on('start', function() {
		if (isClosed)
			return ;

		var inputcommand = [
			'-rtsp_transport', 'tcp',
			'-y',
			'-i', self.stream,
			'-loglevel', 'error'];
		var videocommand = [
			'-vcodec', 'copy',
			'-an',
			'-map', 0,
			'-f', 'segment',
			'-segment_time', 60,
			'-segment_list_size', 5,
			'-segment_list', self.videopath+'/out.m3u8',
			'-strftime', 1,
			self.videopath+'/%Y%m%d%H%M%S.ts'];
		var jpegcommand = [
			'-r', '1',
			'-f', 'image2',
			'-strftime', 1,
			self.jpegpath+'/%M%S.jpg'];

		var check = new EventProxy();
		check.all('onVideoDir', 'onJPEGDir', function(video, jpeg) {
			log.debug(inputcommand.concat(jpegcommand).concat(videocommand));
			ffmpeg = spawn('ffmpeg', inputcommand.concat(jpegcommand).concat(videocommand));
			ffmpeg.stderr.on('data', function(data) {
				log.warn('' + data);
			});
			ffmpeg.on('exit', function(code, signal) {
				event.emit('end');
			});

		});

		fs.exists(self.videopath, function(exists) {
			if (!exists)
				mkdirp(self.videopath, function (err) {
					if (err) {
						log.debug('onVideoDir Error, '+err);
						check.emit('onVideoDir', false);
					} else
						check.emit('onVideoDir', true);
				});
			else
				check.emit('onVideoDir', true);
		});

		fs.exists(self.jpegpath, function(exists) {
			if (!exists)
				mkdirp(self.jpegpath, function (err) {
					if (err) {
						log.debug('onJPEGDir Error, '+err);
						check.emit('onJPEGDir', false);
					} else
						check.emit('onJPEGDir', true);
				});
			else
				check.emit('onJPEGDir', true);

		});
	});

	event.on('end', function() {
		if (!isClosed) {
			setTimeout(function() {
				event.emit('start');
			}, option.retry);
		}
	});

};

//var c = new executor('172.18.70.201');
//c.jpegpath = '../test/jpeg/172.18.70.201/';
//c.videopath = '../test/video/172.18.70.201/';
//c.stream = 'rtsp://Admin:Admin@172.18.70.201/stream1';
//c.open();
module.exports = executor;

