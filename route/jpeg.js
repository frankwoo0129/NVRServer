var fs = require('fs');
var moment = require('moment');
var cameras = require('../lib/controller').cameras;

module.exports = function(app) {
	app.get('/:address/jpeg', function(req, res) {
		fs.realpath(cameras[req.params.address].jpegpath+'/'+moment().subtract(1, 'seconds').format('mmss')+'.jpg', function(err, path) {
			if (err)
				res.send(err);
			else
				res.sendFile(path);
		});
	});
};
