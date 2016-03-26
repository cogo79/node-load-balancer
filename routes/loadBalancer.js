var request = require("request-json");

function passOn(req, res) {
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
}

function allocateStream(route, req, callback) {
	var toLate = false;
	var madeIt = false;
	setTimeout(myPatienceIsOver, 1000);
	nextClient().post(route, req.body, function(error, resFromServer, body) {
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
			console.log(">>>>>>>>>>>>>>>>>>>> load balancer ran out of patience!");
			toLate = true;
			callback(418, null);
		}
	};
}



var sharpVideoServerClients = [];
sharpVideoServerClients.push(request.createClient('http://case1-1.neti.systems:3000/'));
sharpVideoServerClients.push(request.createClient('http://case1-2.neti.systems:3000/'));
sharpVideoServerClients.push(request.createClient('http://case1-3.neti.systems:3000/'));

var testVideoServerClients = [];
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-1.neti.systems/'));
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-2.neti.systems/'));
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-3.neti.systems/'));

var clients = sharpVideoServerClients;
var currentClientIndex = 0;

var lastUsedClientLocal = null;
function nextClient() {
	var i = currentClientIndex;
	if (currentClientIndex <= 1) {
		currentClientIndex++;
	} else {
		currentClientIndex = 0;
	}
	console.log("Will make request to server " + clients[i].host);
	lastUsedClientLocal = clients[i];
	return clients[i];
}

function lastUsedClient() { // Intended for testing only (so far that is)
	return lastUsedClientLocal.host;
}

function totalAmountOfServers() {
	return clients.length;
}

function setToTestMode() {
	clients = testVideoServerClients;
}

module.exports = {
	passOn: passOn,
	setToTestMode: setToTestMode,
	lastUsedClient: lastUsedClient,
	totalAmountOfServers: totalAmountOfServers
};

