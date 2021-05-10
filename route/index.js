/*jslint node: true */
"use strict";

var express = require('express');
var admin = require('./admin');
var video = require('./video');
var jpeg = require('./jpeg');
var lib = require('./lib');
var cameras = require('../lib/controller').cameras;
var root = express.Router();

root.use('/lib', lib);
root.use('/admin', admin);
root.use('/list', function (req, res) {
    var ret = {};
    Object.keys(cameras).forEach(function (address) {
        var obj = {};
        obj.title = cameras[address].title;
        ret[address] = obj;
    });
    res.json(ret);
});

root.use('/:address', function (req, res, next) {
    if (cameras[req.params.address]) {
        req.CameraAddress = req.params.address;
        next();
    } else {
        res.status(404).json({ msg: 'no ipcamera, address=' + req.params.address });
    }
});

root.use('/:address/video', video);
root.use('/:address/jpeg', jpeg);

module.exports = root;
