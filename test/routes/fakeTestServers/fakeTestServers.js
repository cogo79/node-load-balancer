"use strict";

var express = require('express');
var router = express.Router();
var request = require("request-json");
var testServerDestiny = require('./testServerDestiny')();

var testVideoServerClients = [];
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-1.neti.systems/'));
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-2.neti.systems/'));
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-3.neti.systems/'));

var loadBalancerTest = require('../../../modules/load-balancer/loadBalancer')(testVideoServerClients);
loadBalancerTest.setTimeOut(500);

router.post('/allocateStream', function(req, res, next) {

	if (req.body.firstTest) {
		loadBalancerTest.getClientIterator().setIndex(0);
		delete req.body.firstTest;
		console.log("\n\n\n\n\n\n\n\n\n\n\nUnit testing\n\n\n\n\n");
	}

	if (req.body.startIndex) {
		loadBalancerTest.getClientIterator().setIndex(req.body.startIndex);
		delete req.body.startIndex;
	}

	if (req.body.testServerDestiny) {
		testServerDestiny.willHappen(req.body.testServerDestiny);
		delete req.body.testServerDestiny;
	}

	loadBalancerTest.passOn(req, function loadBalancerTestDone(statusCode, body) {
		body.lastUsedClientHost = loadBalancerTest.getClientIterator().getPrevious().host;
		body.statusCode = statusCode;
		
		res.status(200).json(body);
	});
});

function createTestServer(serverName) {
	router.post('/'+serverName+'/allocateStream', function(req, res, next) {
		console.log("Test server "+serverName+", req.body: \n", req.body);
		var happened = testServerDestiny.happened();
		switch(happened) {
			case 500:
				res.sendStatus(happened);
				break;
			case 418:
				setTimeout(respond, 550);
				break;
			default:
				respond();
		}
		function respond() {
			res.send({
				"url": "http://video1.neti.systems/" + req.body.channelId + "?token=12345",
				"secret": "abcdef"
			});
		};
	});
}
createTestServer("case1-1.neti.systems");
createTestServer("case1-2.neti.systems");
createTestServer("case1-3.neti.systems");

module.exports = router;