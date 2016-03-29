"use strict";
module.exports = function newLoadBalancer(clients) {

	function passOn(req, res, callback2) {
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
					callback2(res, 500, {});
					// res.sendStatus(500);
				}
			} else {
				delete body.secret;
				console.log("Load balancer finished request");
				callback2(res, statusCode, body);
			}
		}
	}

	var timeOut = 1000;
	function allocateStream(req, callback) {
		var toLate = false;
		var madeIt = false;
		setTimeout(myPatienceIsOver, timeOut);
		nextClient().post("allocateStream", req.body, function(error, resFromServer, body) {
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
				console.log(">>>>>>>>>>>>>>>>>>>> load balancer timed out!");
				callback(418, null);
			}
		};
	}

	var currentClientIndex = 0;
	var lastUsedClientLocal = null;
	function nextClient() {
		var i = currentClientIndex;
		if (currentClientIndex <= clients.length - 2) {
			currentClientIndex++;
		} else {
			currentClientIndex = 0;
		}
		console.log("Will make request to server " + clients[i].host);
		lastUsedClientLocal = clients[i];
		return clients[i];
	}
	function lastUsedClientHost() { // Intended for testing only (so far that is)
		if (lastUsedClientLocal)
			return lastUsedClientLocal.host;
		else
			return null;
	}
	function clientsLength() {
		return clients.length;
	}
	function setIndex(i) {
		currentClientIndex = i;
		lastUsedClientLocal = clients[i];
	}
	function setTimeOut(newTimeOut) {
		timeOut = newTimeOut;
	}

	return {
		passOn: passOn,
		lastUsedClientHost: lastUsedClientHost,
		clientsLength: clientsLength,
		setIndex: setIndex,
		setTimeOut: setTimeOut
	}
}


