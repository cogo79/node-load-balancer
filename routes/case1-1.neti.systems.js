var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.send('case1-2.neti.systems');
});

router.post('/', function(req, res, next) {
	request({
		uri: "http://www.sitepoint.com",
		method: "POST",
		timeout: 1000,
		followRedirect: true,
		maxRedirects: 10
	}, function(error, response, body) {
		console.log(body);
	});
});

module.exports = router;
