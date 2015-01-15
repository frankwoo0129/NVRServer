module.exports = function(app) {
	var jpeg = require('./jpeg')(app);
	var video = require('./video')(app);
};
