/*jslint node: true */
"use strict";

var fs = require('fs');
var path = require('path');
var express = require('express');
var moment = require('moment');
var cameras = require('../lib/controller').cameras;
var root = express.Router();

var getPicture = function (req, callback) {
    var filepath = path.join(cameras[req.CameraAddress].jpegpath, moment().subtract(3, 's').format('mmss') + '.jpg');
    fs.stat(filepath, function (err, stat) {
        if (err) {
            callback(err);
        } else if (moment().diff(moment(stat.mtime), 'minutes') > 1) {
            callback();
        } else if (stat.size === 0) {
            callback();
        } else {
            callback(null, filepath);
        }
    });
};

root.get('/', function (req, res) {
    var callback = function (err, filepath) {
        if (err) {
            res.sendStatus(404);
        } else if (filepath) {
            res.sendFile(fs.realpathSync(filepath), { root: '/' });
        } else if (req.count > 10) {
            res.sendStatus(404);
        } else {
            console.log(req.count);
            req.count = req.count + 1;
            getPicture(req, callback);
        }
    };

    req.count = 0;
    getPicture(req, callback);
});


module.exports = root;
