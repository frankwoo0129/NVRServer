/*jslint node: true */
"use strict";

var async = require('async');

function NVRServer(config) {
	if (!(this instanceof NVRServer)) {
		return new NVRServer(config);
	}

	config = config || {};
}

NVRServer.prototype.load = function (callback) {

};

NVRServer.prototype.save = function (callback) {

};

NVRServer.prototype.addIPCamera = function (config, callback) {

};

NVRServer.prototype.removeIPCamera = function (address, callback) {

};

NVRServer.prototype.list = function (callback) {

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
