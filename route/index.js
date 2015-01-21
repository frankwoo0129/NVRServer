var fs = require('fs');
var jpeg = require('./jpeg');
var video = require('./video');
var lib = require('./lib');

module.exports = function(app) {
	app.use('/monitor', jpeg);
	app.use('/video', video);
	app.use('/lib', lib);
	app.get('/', function(req, res) {
		var filepath = fs.realpathSync('./test/example.html');
		res.sendFile(filepath);
	});
};
