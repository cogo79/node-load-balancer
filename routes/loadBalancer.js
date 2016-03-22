var express = require('express');
var clientHandler = require("./clientHandler");

var router = express.Router();

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

function allocateStream(route, req, callback) {
	var toLate = false;
	var madeIt = false;
	setTimeout(myPatienceIsOver, 1000);
	clientHandler.nextClient().post(route, req.body, function(error, resFromServer, body) {
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

