var cameras = require('./lib/controller').cameras;
var fs = require('fs');
var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.send('Welcome NVRServer');
});

app.get('/:address', function(req, res) {
	res.sendFile(cameras[req.params.address].jpegpath+'/5520.jpg');
});

app.listen(3000);
