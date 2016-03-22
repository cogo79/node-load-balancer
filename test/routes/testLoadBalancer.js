var express = require('express');
var async = require('Async');
var router = express.Router();
var serverDestiny = require('./serverDestiny');
var clientHandler = require('../../routes/clientHandler');
var request = require("request-json");

router.get('/', function(req, res, next) {

	console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nUnit testing\n\nStart server and load-balancer tests\n\n\n");

	clientHandler.setToTestMode();
	var testPassed = "Test passed";
	var testFailed = "Test failed";
	var tests = {
		succeeded: [],
		failed: []
	};
	async.series([
		function(cb) {
			serverDestiny.willHappen([500, 500, 500]);

			var t1 = {
				name: "Three 500 Errors",
				description: "Load-balancer will get three 500 errors and test will assert that the load-balancer will respond with a 500 status code"
			}
			console.log("\n\n\n\n\n\nNew test: "+t1.name);
			console.log();
			console.log(t1.description);
			console.log();
			request.createClient('http://localhost:3000/').post("allocateStream", {"channelId":"svt1"}, function(error, resFromServer, body) {
				//console.log("18 resFromServer: ", resFromServer);
				console.log("test ------------------------------------------------------------------");
				console.log("18 error: ", error);
				console.log("18 body: ", body);
				console.log("18 resFromServer.statusCode: ", resFromServer.statusCode);
				console.log("test ------------------------------------------------------------------");
				if (resFromServer.statusCode === 500) {
					console.log("\n"+testPassed);
					t1.result = testPassed;
					tests.succeeded.push(t1);
				} else {
					console.log("\n"+testFailed);
					t1.result = testFailed;
					tests.failed.push(t1);
				}
				console.log('\n\n\n');
				cb();
			});
		},
		function(cb) {
			serverDestiny.willHappen([200,500,418,418,500,200,418]);

			var t2 = {
				name: "Three shots",
				description: "Load-balancer will get three requests and the first will succeed on the second shot on server case1-2.neti.systems. Next request will fail on server case1-2.neti.systems. Third request will succed on server case1-1.neti.systems"
			}
			console.log("\n\n\n\n\n\nNew test: "+t2.name);
			console.log();
			console.log(t2.description);
			console.log();

			var req1, req2, req3;
			async.series([
				function(cb2) {
					request.createClient('http://localhost:3000/').post("allocateStream", {"channelId":"svt1"}, function(error, resFromServer, body) {
						//console.log("18 resFromServer: ", resFromServer);
						console.log("test ------------------------------------------------------------------");
						console.log("18 error: ", error);
						console.log("18 body: ", body);
						console.log("18 resFromServer.statusCode: ", resFromServer.statusCode);
						console.log("test ------------------------------------------------------------------");
						if (resFromServer.statusCode === 200 && clientHandler.lastUsedClient() === "http://localhost:3000/test/case1-2.neti.systems/") {
							req1 = true;
						} else {
							req1 = false;
						}
						console.log();
						cb2();
					});
				},
				function(cb2) {
					request.createClient('http://localhost:3000/').post("allocateStream", {"channelId":"svt1"}, function(error, resFromServer, body) {
						//console.log("18 resFromServer: ", resFromServer);
						console.log("test ------------------------------------------------------------------");
						console.log("18 error: ", error);
						console.log("18 body: ", body);
						console.log("18 resFromServer.statusCode: ", resFromServer.statusCode);
						console.log("test ------------------------------------------------------------------");
						if (resFromServer.statusCode === 500 && clientHandler.lastUsedClient() === "http://localhost:3000/test/case1-2.neti.systems/") {
							req2 = true;
						} else {
							req2 = false;
						}
						console.log();
						cb2();
					});
				},
				function(cb2) {
					request.createClient('http://localhost:3000/').post("allocateStream", {"channelId":"svt1"}, function(error, resFromServer, body) {
						//console.log("18 resFromServer: ", resFromServer);
						console.log("test ------------------------------------------------------------------");
						console.log("18 error: ", error);
						console.log("18 body: ", body);
						console.log("18 resFromServer.statusCode: ", resFromServer.statusCode);
						console.log("test ------------------------------------------------------------------");
						if (resFromServer.statusCode === 200 && clientHandler.lastUsedClient() === "http://localhost:3000/test/case1-1.neti.systems/") {
							req3 = true;
						} else {
							req3 = false;
						}
						cb2();
					});
				}
			], function(err) {
				if (err) {
					console.log(err);
				}
				if (req1 && req2 && req3) {
					console.log("\n"+testPassed);
					t2.result = testPassed;
					tests.succeeded.push(t2);
				} else {
					console.log("\n"+testFailed);
					t2.result = testFailed;
					tests.failed.push(t2);
				}
				cb();
			});
		},
		function(cb) {
			serverDestiny.willHappen([200]);

			var t3 = {
				name: "Success on first request",
				description: "Load-balancers first request succeeds on server ."
			}
			console.log("\n\n\n\n\n\nNew test: "+t3.name);
			console.log();
			console.log(t3.description);
			console.log();
			request.createClient('http://localhost:3000/').post("allocateStream", {"channelId":"svt1"}, function(error, resFromServer, body) {
				//console.log("18 resFromServer: ", resFromServer);
				console.log("test ------------------------------------------------------------------");
				console.log("18 error: ", error);
				console.log("18 body: ", body);
				console.log("18 resFromServer.statusCode: ", resFromServer.statusCode);
				console.log("test ------------------------------------------------------------------");
				if (resFromServer.statusCode === 200 && clientHandler.lastUsedClient() === "http://localhost:3000/test/case1-2.neti.systems/") {
					console.log("\n"+testPassed);
					t3.result = testPassed;
					tests.succeeded.push(t3);
				} else {
					console.log("\n"+testFailed);
					t3.result = testFailed;
					tests.failed.push(t3);
				}
				cb();
			});
		}
	], function(err) {
		if (err) {
			console.log(err);
		}
		console.log("\n\n\n\n");
		if (tests.failed.length === 0) {
			console.log("All tests passed.");	
		} else if (tests.succeeded.length === 0) {
			console.log("All tests failed.");	
		} else {
			console.log("Not all tests passed.");	
		}
		console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
		
		clientHandler.setSharpMode();
		serverDestiny.willHappen([]);
		res.status(200).json(tests);
	});
});

module.exports = router;