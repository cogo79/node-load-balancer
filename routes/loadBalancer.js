var express = require('express');
var request = require("request-json");

var router = express.Router();
console.log("var router = express.Router(); --> ", router);

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('Net Insight AB, load balancer');
});

router.post('/', function(req, res, next) {
	console.log("************************************************************************************");
	console.log("load balancer POST req.body:", req.body);
	console.log();
	var trialsLeft = 3;
	allocateStream("allocateStream", req, allocateStreamCallback);
	function allocateStreamCallback(statusCode, body) {
		console.log();
		if (statusCode === 500 || statusCode === 418) {
			if (trialsLeft > 1) {
				trialsLeft--;
				allocateStream("allocateStream", req, allocateStreamCallback);
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
});

var clients = [];
clients.push(request.createClient('http://case1-1.neti.systems:3000/'));
clients.push(request.createClient('http://case1-2.neti.systems:3000/'));
clients.push(request.createClient('http://case1-3.neti.systems:3000/'));
var currentClientIndex = 0;
function getClient() {
	var i = currentClientIndex;
	if (currentClientIndex <= 1) {
		currentClientIndex++;
	} else {
		currentClientIndex = 0;
	}
	console.log("Will make request to server " + clients[i].host);
	return clients[i];
}

function allocateStream(route, req, callback) {
	var toLate = false;
	var madeIt = false;
	setTimeout(myPatienceIsOver, 1000);
	getClient().post(route, req.body, function(error, resFromServer, body) {
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
