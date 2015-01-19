var fs = require('fs');
var path = require('path');
var url = require('url');
var express = require('express');
var cameras = require('../lib/controller').cameras;

var router = express.Router();

router.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://'+req.socket.localAddress+':'+req.socket.localPort);
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	//console.log('address: '+req.socket.localAddress);
	//console.log('port   : '+req.socket.localPort);
	next();
});

router.get('/example.html', function(req, res) {
	var filename = fs.realpathSync('./test/example.html');
	res.sendFile(filename);
});

router.get('/:address/:ts', function(req, res, next) {
	console.log(url.parse(req.url).pathname);
	next();
});
	
router.use(express.static(path.join(__dirname, '../test/video/')));

module.exports = router;
