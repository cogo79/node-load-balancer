"use strict";
module.exports = function newLoadBalancer(clients) {
	var clientIterator = require('./iterator')(clients);
	function passOn(req, callback) {
		console.log("************************************************************************************");
		console.log("load balancer POST req.body:", req.body);
		console.log();
		var trialsLeft = 3;
		allocateStream(req, allocateStreamCallback);
		function allocateStreamCallback(statusCode, body) {
			console.log();
			if (statusCode === 500 || statusCode === 418) {
				if (trialsLeft > 1) {
					trialsLeft--;
					allocateStream(req, allocateStreamCallback);
				} else {
					console.log("Load balancer finished request. All servers failed.");
					callback(500, {});
				}
			} else {
				delete body.secret;
				console.log("Load balancer finished request successfully.");
				callback(statusCode, body);
			}
		}
	}

	var timeOut = 1000;
	function allocateStream(req, callback) {
		var toLate = false;
		var madeIt = false;
		setTimeout(myPatienceIsOver, timeOut);
		var nextClient = clientIterator.getNext();
		console.log("Will make request to server " + nextClient.host);
		nextClient.post("allocateStream", req.body, function(error, resFromServer, body) {
			if (!toLate) {
				madeIt = true;
				console.log("------------------------------- Response -------------------------------");
				console.log("error: ", error);
				console.log("body: ", body);
				console.log("resFromServer.statusCode: ", resFromServer.statusCode);
				console.log("------------------------------------------------------------------------");
				callback(resFromServer.statusCode, body);
			}
		});

		function myPatienceIsOver () {
			if (madeIt === false) {
				toLate = true;
				console.log(">>>>>>>>>>>>>>>>>>>> Load-balancer timed out!");
				callback(418, null);
			}
		};
	}

	function setTimeOut(newTimeOut) {
		timeOut = newTimeOut;
	}

	function getClientIterator() {
		return clientIterator;
	}

	return {
		passOn: passOn,
		setTimeOut: setTimeOut,
		getClientIterator: getClientIterator
	}
}


