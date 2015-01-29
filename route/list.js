/*jslint node: true */
/*jslint nomen: true */
"use strict";

var express = require('express');
var cameras = require('../lib/controller').cameras;

var root = express.Router();

root.get('/', function (req, res) {
    var ret = {};
    Object.keys(cameras).forEach(function (address) {
        var obj = {};
        obj.title = cameras[address].title;
        ret[address] = obj;
    });
    res.json(ret);
});

module.exports = root;