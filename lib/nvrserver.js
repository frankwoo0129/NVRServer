/*jslint node: true */
"use strict";

var async = require('async');
var log = require('loglevel');
var IPCamera = require('./ipcamera');
var config = require('../config');
var list = {};

function NVRServer(config) {
	if (!(this instanceof NVRServer)) {
		return new NVRServer(config);
	}

	config = config || {};
}

NVRServer.prototype.load = function (callback) {
	log.debug(config);

	var model = config.model,
		storage = config.storage,
		configsource = config.config;

	async.each(configsource, function (item, callback) {
		async.forEachOf(storage.storage, function (value, key, callback) {

		}, function (err) {

		});
	}, function (err) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});
};

NVRServer.prototype.save = function (callback) {

};

NVRServer.prototype.addIPCamera = function (config, preview, callback) {
	if (typeof preview === 'function') {
		callback = preview;
		preview = false;
	}

	if (!callback || typeof callback !== 'function') {
		throw new Error('No callback function');
	}

	try {
		var ipcamera = new IPCamera(config);
		if (preview === 'true') {
			return ipcamera.screenshot(callback);
		} else {
			list[ipcamera.address] = ipcamera;
			return ipcamera.open(callback);
		}
	} catch (err) {
		return callback(err);
	}
};

NVRServer.prototype.removeIPCamera = function (address, callback) {
	if (!callback || typeof callback !== 'function') {
		throw new Error('No callback function');
	}

	if (!address) {
		throw new Error('No address');
	}

	if (list[address]) {
		return callback(new Error('No this camera'));
	} else {
		var ipcamera = list[address];
		ipcamera.close();
		delete list[address];
		return callback();
	}
};

NVRServer.prototype.list = function (callback) {
	var ret = {};
	async.forEachOf(list, function (value, key, callback) {
		var config = {
			address: value.address,
			title: value.title,
			model: value.model
		};
		ret[key] = config;
		callback();
	}, function (err) {
		callback(err, ret);
	});
};

NVRServer.prototype.start = function (address, callback) {
	if (typeof address === 'function') {
		callback = address;
		address = undefined;
	}

	if (typeof callback !== 'function') {
		throw new Error('No callback function');
	}

	var self = this;
	if (!address) {
		async.forEachOf(self.list, function (value, key, callback) {
			value.open(callback);
		}, function (err) {
			if (err) {
				callback(err);
			} else {
				callback();
			}
		});
	} else if (self.list[address]) {
		self.list[address].open(callback);
	} else {
		return callback(new Error('No this ipcamera'));
	}
};

NVRServer.prototype.stop = function (address, callback) {
	if (typeof address === 'function') {
		callback = address;
		address = undefined;
	}

	if (typeof callback !== 'function') {
		throw new Error('No callback function');
	}

	var self = this;
	if (!address) {
		async.forEachOf(self.list, function (value, key, callback) {
			value.close();
			callback();
		}, function (err) {
			if (err) {
				callback(err);
			} else {
				callback();
			}
		});
	} else if (self.list[address]) {
		self.list[address].close();
		return callback();
	} else {
		return callback(new Error('No this ipcamera'));
	}
};
