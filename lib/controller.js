var fs = require('fs');
var util = require('util');
var underscore = require('underscore');
var EventProxy = require('eventproxy');
var Executor = require('./executor');

var configfile = '../config/NN/camera.json';
var storagefile = '../config/NN/storage.json';
var modelfile = '../config/model.json';
var event = new EventProxy();
var cameras = {};

function close() {
	underscore.each(cameras, function(camera, address) {
		camera.close();
	});
};

event.all('onConfigReady', 'onStorageReady', function(configmap, storagemap) {
	underscore.each(configmap, function(config, address) {
		var camera = new Executor(address);
		camera.title = config.title;
		camera.stream = config.stream;
		if (storagemap[address]) {
			camera.jpegpath = storagemap[address].jpegpath+'/'+address;
			camera.videopath = storagemap[address].videopath+'/'+address;
			cameras[address] = camera;
			camera.open();
		} else {
			throw new Error('Storage setting error, address=' + address);
		}
	});
});

event.on('onModelReady', function(modelmap) {
	fs.readFile(configfile, 'utf8', function(err, data) {
		var configsource = JSON.parse(data);
		var configmap = {};
		underscore.each(configsource, function(config) {
			var conf = {};
			if (!config.address)
				throw new Error('No address');
			if (!config.model )
				throw new Error('No model');
			if (!config.title)
				throw new Error('No title');
			conf.address = config.address;
			conf.title = config.title;
			if (!modelmap[config.model]) {
				throw new Error('No this model, ' + config.model);
			} else if (!config.user || !config.passwd) {
				var stream = modelmap[config.model];
				conf.stream = util.format(stream.replace('%s:%s@%s', '%s'), config.address);
			} else {
				var stream = modelmap[config.model];
				conf.stream = util.format(stream, config.user, config.passwd, config.address);
			}
			configmap[config.address] = conf;
		});
		//console.log(configmap);
		event.emit('onConfigReady', configmap);
	});
});


fs.readFile(storagefile, 'utf8', function(err, data) {
	var storagesource = JSON.parse(data);
	var storagemap = {};
	if (!storagesource.jpegpath)
		throw new Error('No jpegpath');
	underscore.each(storagesource.storage, function(group) {
		if (!group.videopath)
			throw new Error('No videopath');
		underscore.each(group.list, function(value, key) {
			var conf = {};
			conf.videopath = group.videopath;
			conf.jpegpath = storagesource.jpegpath;
			storagemap[key] = conf;
		});
	});
	//console.log(storagemap);
	event.emit('onStorageReady', storagemap);
});

fs.readFile(modelfile, 'utf8', function(err, data) {
	var models = JSON.parse(data);
	var modelmap = {};
	underscore.each(models, function(model) {
		modelmap[model.model] = model.rtsp;
	});
	//console.log(modelmap);
	event.emit('onModelReady', modelmap);
});
