var express = require('express');
var root = express.Ruoter();

root.use('/monitor/*', function(req, res, next) {
	if(auth)
		next();
	else {
		res.json(401, {});
	}
});

root.use('/video/*', function(req, res, next) {
	if (auth)
		next()
	else {
		res.json(401, {});
	}
});

root.use('/admin/*', function(req, res, next) {
	if (auth)
		next()
	else {
		res.json(401, {});
	}
});
