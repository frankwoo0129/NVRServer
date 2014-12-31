var spawn = require('child_process').spawn;
var EventEmitter = require('events').EventEmitter;
var moment = require('moment');

var executor = function(address) {
	this.address = address;
	this.stream = 'rtsp://Admin:Admin@172.18.70.200/stream1';
	this.videopath = null;
	this.jpegpath = null;
	
	var self = this;
	var event = new EventEmitter();
	var ffmpeg = null;
	var isClosed = true;
	
	this.open = function() {
		if (ffmpeg != null) {
			ffmpeg.kill();
		} 
		isClosed = false;
		event.emit('start');
	};

	this.close = function() {
		isClosed = true;
		if (ffmpeg) {
			ffmpeg.kill();
			ffmpeg = null;
		}
	};

	event.on('start', function() {
		if (isClosed)
			return ;
		var millis = 500;
		var now = moment();
		var before = moment().startOf('hour');
		var startnumber = Math.floor(now.diff(before)/millis);
		var time = before.add(1, 'hour').subtract(now).format('HH:mm:ss');
		var date = now.format('YYYYMMDDHH[%02d]ss');

		var inputcommand = ['-rtsp_transport', 'tcp', '-y', '-i', self.stream, '-loglevel', 'error'];
		var videocommand = [
			'-vcodec', 'copy',
			'-an',
			'-map', 0,
			'-f', 'segment',
			'-t', time,
			'-segment_start_number', now.format('mm'),
			'-segment_time', 60,
			'-segment_list_size', 5,
			'-segment_list', 'out.m3u8',
			'-strftime', 1,
			'%Y-%m-%d_%H-%M-%S.ts'];
		var jpegcommand = [
			'-vf', 'fps=fps=1000/'+millis,
			'-start_number', startnumber,
			'-f', 'image2',
			'-t', time,
			'out%04d.mp4'];
		
		ffmpeg = spawn('ffmpeg', inputcommand.concat(videocommand));
		ffmpeg.stderr.on('data', function(data) {
			console.log('' + data);
		});
		ffmpeg.on('exit', function(code, signal) {
			if (code)
				console.log('code  : ' + code);
			if (signal)
				console.log('signal: ' + signal);
			event.emit('end');
		});
	});

	event.on('end', function() {
		if (!isClosed)
			event.emit('start');
	});

};

//var ipcam = new executor('172.18.70.200');
//ipcam.open();
console.log(moment().format('X'));
console.log(moment('2014-12-31 09:00').format('X'));
console.log(moment('2014-12-31 09:01').format('X'));
console.log(moment(1419987600000).format());
