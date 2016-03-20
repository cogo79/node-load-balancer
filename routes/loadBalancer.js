var express = require('express');
var request = require("request-json");

var router = express.Router();
var client = request.createClient('http://localhost:3000/');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('Net Insight AB, load balancer');
});

router.post('/', function(req, res, next) {
	console.log("************************************************************************************");
	console.log("load balancer POST req.body:", req.body);
	console.log();
	loadBalancer(req, res);
});

var servers = ['case1-1.neti.systems', 'case1-2.neti.systems', 'case1-3.neti.systems'];
var currentServerIndex = 0;
function getServer() {
	var i = currentServerIndex;
	if (currentServerIndex <= 1) {
		currentServerIndex++;
	} else {
		currentServerIndex = 0;
	}
	console.log("Will make request to server " + servers[i]);
	return servers[i];
}

function loadBalancer(req, res) {
	var trialsLeft = 3;
	allocateStream(getServer(), req, allocateStreamCallback);
	function allocateStreamCallback(statusCode, body) {
		console.log();
		if (statusCode === 500 || statusCode === 418) {
			if (trialsLeft > 1) {
				trialsLeft--;
				allocateStream(getServer(), req, allocateStreamCallback);
			} else {
				res.sendStatus(500);
				console.log("Load balancer finished request. All servers failed.");
			}
		} else {
			delete body.secret;
			res.status(statusCode).json(body);
			console.log("Load balancer finished request");
		}
	}
}

function allocateStream(server, req, callback) {
	var toLate = false;
	var madeIt = false;
	setTimeout(myPatienceIsOver, 1000);
	client.post(server, req.body, function(error, resFromServer, body) {
		//console.log("18 resFromServer: ", resFromServer);
		if (!toLate) {
			madeIt = true;
			console.log("------------------------------------------------------------------");
			console.log("18 error: ", error);
			console.log("18 body: ", body);
			console.log("18 resFromServer.statusCode: ", resFromServer.statusCode);
			console.log("------------------------------------------------------------------");
			callback(resFromServer.statusCode, body);
		}
	});

	function myPatienceIsOver () {
		if (madeIt === false) {
			console.log(">>>>>>>>>>>>>>>>>>>> load balancer ran out of patience!");
			toLate = true;
			callback(418, null);
		}
	};
}

module.exports = router;
