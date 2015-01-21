var express = require('express');

var root = express.Router();
var camera = require('./camera');
var group = require('./group');
var user = require('./user');

root.use('/camera', camera);
root.use('/group', group);
root.use('/user', user);

module.exports = root;
