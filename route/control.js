var cameras = require('../lib/controller').cameras;

module.exports = function(app) {
	app.post('/:address/start', function(req,res) {
		var camera = cameras[req.params.address];
		if(camera)
			camera.open();
		else {
			res.json({
				code: 404,
				msg: 'No camera, address='req.params.address
			});
		}
	});

	app.post('/:address/stop', function(req, res) {
		var camera = cameras[req.params.address];
		if(camera)
			camera.close();
		else {
			res.json({
				code: 404,
				msg: 'No camera, address='req.params.address
			});
		}
	});

	app.post('/:address/restart', function(req, res) {
		var camera = cameras[req.params.address];
		if(camera) {
			camera.open();
		} else {
			res.json({
				code: 404,
				msg: 'No camera, address='req.params.address
			});
		}
	});
};
