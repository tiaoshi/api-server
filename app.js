var app = module.exports = require('koa')();
var mongoose = require('mongoose');
var fs = require('fs');

fs.readFile('config.json', function (err, data) {
	if (err) throw err;
	var config = JSON.parse(data.toString());
	mongoose.connect(config.mongo.url, config.mongo.connection, function (m) {
		//console.log(JSON.stringify(config));
		//console.log(mongoose.connection.readyState);
	});
});

app.use(function* (next) {
	if (this.path !== '/') return yield next;
	this.cookies.set('sitekey', 'YA-1234567890');
	this.body = 'a server that uses cookies';
});

app.use(function* (next) {
	if (this.path !== '/apis/sitekeys') return yield next;
	
	if (queryIsValid(this.query) === false) {
		this.status = 401;
		return yield next;
	};

	this.type = 'application/json';

	var obj = { key: 'YA-1234567890' };

	this.body = JSON.stringify(obj);

	function queryIsValid(query) {
		if (typeof query === 'object' && query.domain)
			return true;
		return false;
	};
});

if (!module.parent) app.listen(3000);
