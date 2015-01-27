var fs = require('fs');
var util = require('util');
var path = require('path');
var underscore = require('underscore');
var EventProxy = require('eventproxy');
var log = require('loglevel');

var Executor = require('../lib/executor');
var option = require('../config/option');
var model = require('../config/model');
var storage = require('../config/'+option.site+'/storage');
var configfile = 'config/'+option.site+'/camera.json';

var event = new EventProxy();
var cameras = {};

event.tail('onReady', 'onStart', function(ready, address) {
	if (!address || address == null) {
		log.info('start all cameras');
		underscore.each(cameras, function(camera, address) {
			log.info('camera open, address='+address);
			camera.open();
		});
	} else if (cameras[address]) {
		log.info('camera open, address='+address);
		cameras[address].open();
	} else {
		log.error('No this camera, address='+address);
	}
});

event.tail('onReady', 'onStop', function(ready, address) {
	if (!address || address == null) {
		log.info('stop all cameras');
		underscore.each(cameras, function(camera, address) {
			log.info('camera close, address='+address);
			camera.close();
		});
	} else if (cameras[address]) {
		log.info('camera close, address='+address);
		cameras[address].close();
	} else {
		log.error('No this camera, address='+address);
	}
});

module.exports.load = function() {
	log.debug(option);
	log.debug(model);
	log.debug(storage);
	if (!storage.jpegpath)
		throw new Error('No jpegpath');
	if (!storage.videopath)
		throw new Error('No videopath');
	if (!storage.temp)
		throw new Error('No temp dir');

	fs.readFile(configfile, 'utf8', function(err, data) {
		var configsource = JSON.parse(data);
		underscore.each(configsource, function(config) {
			if (!config.address)
				throw new Error('No address');
			if (!config.model )
				throw new Error('No model');
			if (!config.title)
				throw new Error('No title');
			if (!config.storage)
				throw new Error('No storage');

			var camera = new Executor(config.address);
			if (!model[config.model]) {
				throw new Error('No this model, ' + config.model);
			} else if (!config.user || !config.passwd) {
				var stream = model[config.model];
				camera.stream = util.format(stream.replace('%s:%s@%s', '%s'), config.address);
			} else {
				var stream = model[config.model];
				camera.stream = util.format(stream, config.user, config.passwd, config.address);
			}
			if (!storage.storage[config.storage])
				throw new Error('No this storage, ' + config.storage);
			else {
				camera.videopath = path.join(storage.videopath, storage.storage[config.storage].path, config.address);
				camera.jpegpath = path.join(storage.jpegpath, config.address);
				camera.monitorpath = path.join(storage.temp, config.address);
			}
			camera.title = config.title;
			cameras[config.address] = camera;
		});
		log.debug(cameras);
		log.info('onReady');
		event.emit('onReady', null);
	});
};

module.exports.start = function(address) {
	event.emit('onStart', address);
};

module,exports.stop = function(address) {
	event.emit('onStop', address);
};

module.exports.cameras = cameras;
