var express = require('express');
var router = express.Router();
var request = require("request");

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('Net Insight AB, load balancer');
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
