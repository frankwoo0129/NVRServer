var express = require('express');
var cameras = require('../lib/controller').cameras;
var root = express.Router();

root.use('/camera');
root.use('/group');
root.use('/user');

module.exports = root;
