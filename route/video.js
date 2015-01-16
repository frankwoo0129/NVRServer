var fs = require('fs');
var path = require('path');
var url = require('url');
var express = require('express');
var cameras = require('../lib/controller').cameras;

module.exports = function(app) {
	app.get('/:address/video',function(req, res) {
		res.end({msg: 'GOOD'});
	});

	app.get('/:address/play.html', function(req, res) {
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.write('<html><head><title>HLS Player fed by node.js' + '</title></head><body>');
		res.write('<video src="http://' + req.socket.localAddress + ':3000/' + req.params.address + '/out.m3u8" type="application/x-mpegURL" controls autoplay></body></html>');
		res.end();
		return;
	});
	
	
	
	app.get('/:address/play.m3u8', function(req, res, next) {
		/*
		var filename = fs.realpathSync(cameras[req.params.address].videopath + '/play.m3u8');
		fs.readFile(filename, function (err, contents) {
			if (err) {
				res.writeHead(500);
				res.end();
			} else if (contents) {
				res.writeHead(200, {'Content-Type': 'application/x-mpegURL'});
				res.end(contents, 'utf-8');
			} else {
				console.log('emptly playlist');
				res.writeHead(500);
				res.end();
			}
		});
		*/
		console.log(url.parse(req.url).pathname);
		next();
	});
	
	app.get('/:address/:ts', function(req, res, next) {
		/*
		var filename = fs.realpathSync(cameras[req.params.address].videopath + '/' + req.params.ts);
		console.log(filename);
		var stream = fs.createReadStream(filename, {bufferSize: 32*1024*1024});
		stream.on('open', function() {
			console.log('stream open');
			stream.pipe(res);
		});
		stream.on('error', function(err) {
			console.log('stream error');
			res.end(err);
		});
		*/
		console.log(url.parse(req.url).pathname);
		next();
	});
	
	app.use(express.static(path.join(__dirname, '../test/video/')));

};
