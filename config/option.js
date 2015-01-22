var option = {
	site: 'HC',
	loglevel: 'debug',
	port: 3000
};

var log = require('loglevel');
log.setLevel(option.loglevel);

module.exports = option;
