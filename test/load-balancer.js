const assert = require('assert');
var app = require('./setupTestServers').app();
var serverDestiny = require('./routes/serverDestiny');
var clientHandler = require('../routes/clientHandler');

var request = require("request-json");

describe('All video servers responded to late', function() {
	console.log(clientHandler);
	console.log(serverDestiny);
	before(function(done) {
		serverDestiny.willHappen([500, 500, 500]);
		clientHandler.setToTestMode();
		console.log("before");
 		clientHandler.whatsGoingOn();
		done();
	});
	after(function(done) {
		/*
		serverDestiny.willHappen([]);
		clientHandler.setSharpMode();
		console.log("after");
 		clientHandler.whatsGoingOn();*/
		done();
	});
 	it('simple test', function(done) {
 		console.log("testing");
 		clientHandler.whatsGoingOn();
		request.createClient('http://localhost:3000/').post("allocateStream", {"channelId":"svt1"}, function(error, resFromServer, body) {
			//console.log("18 resFromServer: ", resFromServer);
			console.log("test ------------------------------------------------------------------");
			console.log("18 error: ", error);
			console.log("18 body: ", body);
			console.log("18 resFromServer.statusCode: ", resFromServer.statusCode);
			console.log("test ------------------------------------------------------------------");
			assert(resFromServer.statusCode === 500);
			done();
		});
	});
});
