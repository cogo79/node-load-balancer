var express = require('express');
var router = express.Router();
var request = require("request-json");
var client = request.createClient('http://localhost:3000/');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('Net Insight AB, load balancer');
});

router.post('/', function(req, res, next) {
	console.log("load balancer POST req.body:", req.body);
	client.post('case1-1.neti.systems', req.body, function(error, resFromServer, body) {
		console.log("------------------------------------------------------------------");
		console.log("18 error: ", error);
		//console.log("18 response: ", response);
		console.log("18 body: ", body);
		console.log("------------------------------------------------------------------");
		res.send(200);
	});
});

module.exports = router;
