/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var util = require('util');
var underscore = require('underscore');
var EventProxy = require('eventproxy');
var log = require('loglevel');
var Executor = require('./executor');
var config = require('../config');
var event = new EventProxy();
var cameras = {};

event.tail('onReady', 'onStart', function (ready, address) {
    if (!address) {
        log.info('start all cameras');
        underscore.each(cameras, function (camera, address) {
            log.info('camera open, address=' + address);
            camera.open();
        });
    } else if (cameras[address]) {
        log.info('camera open, address=' + address);
        cameras[address].open();
    } else {
        log.error('No this camera, address=' + address);
    }
});

event.tail('onReady', 'onStop', function (ready, address) {
    if (!address) {
        log.info('stop all cameras');
        underscore.each(cameras, function (camera, address) {
            log.info('camera close, address=' + address);
            camera.close();
        });
    } else if (cameras[address]) {
        log.info('camera close, address=' + address);
        cameras[address].close();
    } else {
        log.error('No this camera, address=' + address);
    }
});

module.exports.load = function () {
    log.debug(config);

    var model = config.model,
        storage = config.storage,
        configsource = config.config;

    underscore.each(configsource, function (config) {
        if (!config.address) {
            throw new Error('No address');
        } else if (!config.title) {
            throw new Error('No title');
        } else if (!config.storage) {
            throw new Error('No storage');
        } else if (!storage.storage[config.storage]) {
            throw new Error('No this storage, ' + config.storage);
        } else if (!config.stream && !config.model) {
            throw new Error('No model or stream');
        } else {
            var camera = new Executor(config.address),
                stream;
            if (config.stream) {
                camera.stream = config.stream;
            } else if (model[config.model]) {
                stream = model[config.model];
                if (!config.user || !config.passwd) {
                    camera.stream = util.format(stream.replace('%s:%s@%s', '%s'), config.address);
                } else {
                    camera.stream = util.format(stream, config.user, config.passwd, config.address);
                }
            } else {
                throw new Error('No this model: ' + config.model);
            }

            camera.videopath = path.join(storage.videopath, storage.storage[config.storage].path, config.address);
            camera.jpegpath = path.join(storage.jpegpath, config.address);
            camera.title = config.title;
            cameras[config.address] = camera;
        }
    });

    log.debug(cameras);
    log.info('onReady');
    event.emit('onReady', null);
};

module.exports.start = function (address) {
    event.emit('onStart', address);
};

module.exports.stop = function (address) {
    event.emit('onStop', address);
};

module.exports.cameras = cameras;
