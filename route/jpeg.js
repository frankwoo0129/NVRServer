var fs = require('fs');
var path = require('path');
var express = require('express');
var cameras = require('../lib/controller').cameras;
var option = require('../config/option');
var storage = require('../config/'+option.site+'/storage');

var root = express.Router();

root.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://'+req.socket.localAddress+':'+req.socket.localPort);
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	//console.log('address: '+req.socket.localAddress);
	//console.log('port   : '+req.socket.localPort);
	next();
});

root.get('/:address/:file', function(req, res, next) {
	console.log(req.url);
	if (cameras[req.params.address])
		next();
	else
		next('error');
});
	
root.use(express.static(path.join(__dirname, '../', storage.jpegpath)));

module.exports = root;
