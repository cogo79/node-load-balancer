"use strict";

var express = require('express');
var async = require('Async');
var router = express.Router();
var serverDestiny = require('./serverDestiny');
var loadBalancer = require('../../routes/loadBalancer');
var request = require("request-json");

// GET home page.
router.get('/', function(req, res, next) {
	res.render('index', { title: '© Net Insight AB, load-balancer' });
});

router.post('/allocateStream', function(req, res, next) {
	loadBalancer.passOn(req, res);
});

router.post('/test/allocateStream', function(req, res, next) {
	loadBalancer.setToTestMode();
	serverDestiny.willHappen(req.body.serverDestiny);
	delete req.body.serverDestiny;
	request.createClient('http://localhost:3000/').post('allocateStream', req.body, function(error, resFromServer, body) {
		assert(resFromServer.statusCode === 500);
		cb();
	});
});

function createTestServer(serverName) {
	router.post('/'+serverName+'/allocateStream', function(req, res, next) {
		console.log("test "+serverName+" server req.body: ", req.body);
		var happened = serverDestiny.happened();
		switch(happened) {
			case 500:
				res.sendStatus(happened);
				break;
			case 418:
				setTimeout(respond, 1050);
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


router.get('/test/allocateStream', function(req, res, next) {

	var url = 'http://localhost:3000/';
	var allocateStream = 'allocateStream';

	loadBalancer.setToTestMode();

	console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nUnit testing\n\nStart server and load-balancer tests\n\n\n");

	var tests = {
		succeeded: [],
		failed: []
	};
	function startNewTest(test, performTest) {
		console.log("\n\n\n\n\n\nNew test: "+test.name);
		console.log();
		console.log(test.description);
		console.log();
		performTest(assert);
		function assert(testPassed) {
			var testPassedStr = "Test passed";
			var testFailedStr = "Test failed";
			if (testPassed) {
				console.log("\n"+testPassedStr);
				test.result = testPassedStr;
				tests.succeeded.push(test);
			} else {
				console.log("\n"+testFailedStr);
				test.result = testFailedStr;
				tests.failed.push(test);
			}
			console.log('\n\n\n');
		}
	}
	async.series([
		function(cb) {
			serverDestiny.willHappen([500, 500, 500]);
			var test = {
				name: "Three 500 Errors",
				description: "Load-balancer will get three 500 errors and test will assert that the load-balancer will respond with a 500 status code"
			};
			startNewTest(test, function(assert) {
				request.createClient(url).post(allocateStream, {"channelId":"svt1"}, function(error, resFromServer, body) {
					assert(resFromServer.statusCode === 500);
					cb();
				});
			});
		},
		function(cb) {
			serverDestiny.willHappen([200,418]);
			var test = {
				name: "Success on second request",
				description: "Load-balancer will succeed on the second request on server case1-2.neti.systems."
			};
			startNewTest(test, function(assert) {
				request.createClient(url).post(allocateStream, {"channelId":"svt1"}, function(error, resFromServer, body) {
					assert(resFromServer.statusCode === 200 && loadBalancer.lastUsedClientHost() === "http://localhost:3000/test/case1-2.neti.systems/");
					cb();
				});
			});
		},
		function(cb) {
			serverDestiny.willHappen([418,418,500]);
			var test = {
				name: "Request to load-balancer failed.",
				description: "Next request will fail on server case1-2.neti.systems."
			}
			startNewTest(test, function(assert) {
				request.createClient(url).post(allocateStream, {"channelId":"svt1"}, function(error, resFromServer, body) {
					assert(resFromServer.statusCode === 500 && loadBalancer.lastUsedClientHost() === "http://localhost:3000/test/case1-2.neti.systems/");
					cb();
				});
			});
		},
		function(cb) {
			serverDestiny.willHappen([200,500]);
			var test = {
				name: "Successfull response on second try.",
				description: "Load-balancer will get successfull response second try on server case1-1.neti.systems"
			}
			startNewTest(test, function(assert) {
				request.createClient(url).post(allocateStream, {"channelId":"svt1"}, function(error, resFromServer, body) {
					assert(resFromServer.statusCode === 200 && loadBalancer.lastUsedClientHost() === "http://localhost:3000/test/case1-1.neti.systems/");
					cb();
				});
			});
		},
		function(cb) {
			serverDestiny.willHappen([200]);
			var test = {
				name: "Success on first request",
				description: "Load-balancers first request succeeds on server case1-2.neti.systems."
			}
			startNewTest(test, function(assert) {
				request.createClient(url).post(allocateStream, {"channelId":"svt1"}, function(error, resFromServer, body) {
					assert(resFromServer.statusCode === 200 && loadBalancer.lastUsedClientHost() === "http://localhost:3000/test/case1-2.neti.systems/");
					cb();
				});
			});
		}
	], function(err) {
		if (err) {
			console.log(err);
		}
		console.log("\n\n\n\n");
		console.log("Unit testing result:\nPassed: "+tests.succeeded.length+"      Failed: "+tests.failed.length+"\n");
		if (tests.failed.length === 0 && tests.succeeded.length === 0) {
			console.log("No unit tests was performed.");
		} else if (tests.failed.length === 0) {
			console.log("All tests passed.");	
		} else if (tests.succeeded.length === 0) {
			console.log("All tests failed.");	
		} else {
			console.log("Not all tests passed.");	
		}
		console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
		
		loadBalancer.setToSharpMode();
		serverDestiny.willHappen([]);
		res.status(200).json(tests);
	});
});

module.exports = router;
