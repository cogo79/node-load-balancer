"use strict";

var request = require("request-json");

function passOn(req, res) {
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
				return res.sendStatus(500);
				console.log("Load balancer finished request. All servers failed.");
			}
		} else {
			delete body.secret;
			console.log("Load balancer finished request");
			return res.status(statusCode).json(body);
		}
	}
}

function allocateStream(req, callback) {
	var toLate = false;
	var madeIt = false;
	setTimeout(myPatienceIsOver, 1000);
	nextClient().post("allocateStream", req.body, function(error, resFromServer, body) {
		//console.log("18 resFromServer: ", resFromServer);
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
			console.log(">>>>>>>>>>>>>>>>>>>> load balancer ran out of patience!");
			callback(418, null);
		}
	};
}


var sharpIndex = 0;
var sharpVideoServerClients = [];
sharpVideoServerClients.push(request.createClient('http://case1-1.neti.systems:3000/'));
sharpVideoServerClients.push(request.createClient('http://case1-2.neti.systems:3000/'));
sharpVideoServerClients.push(request.createClient('http://case1-3.neti.systems:3000/'));

var testIndex = 0;
var testVideoServerClients = [];
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-1.neti.systems/'));
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-2.neti.systems/'));
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-3.neti.systems/'));

var clients = sharpVideoServerClients;
var currentClientIndex = sharpIndex;

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
	return lastUsedClientLocal.host;
}

function setToTestMode() {
	clients = testVideoServerClients;
	sharpIndex = currentClientIndex;
	currentClientIndex = testIndex;
}

function setToSharpMode() {
	clients = sharpVideoServerClients;
	currentClientIndex = sharpIndex;
}

module.exports = {
	passOn: passOn,
	lastUsedClientHost: lastUsedClientHost,
	setToTestMode: setToTestMode,
	setToSharpMode: setToSharpMode
};

