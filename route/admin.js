/*jslint node: true */
/*jslint nomen: true */
"use strict";

var express = require('express');
var camera = require('./admin-camera');
var group = require('./admin-group');
var user = require('./admin-user');

var root = express.Router();

root.use('/camera', camera);
root.use('/group', group);
root.use('/user', user);

module.exports = root;
