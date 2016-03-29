"use strict";

const assert = require('assert');
var request = require('request-json');

var url = 'http://localhost:3000/test/';
var allocateStream = 'allocateStream';
describe("Test load-balancer", function() {
	/*
	 * Unit testing
	 * Run this curl command when server is running:
	 * curl http://localhost:3000/test/allocateStream
	 * This will perform unit testing for the load-balancer.
	 *
	 * Mocha did not work very well for me when trying to unit test the load-balancer.
	 *
	 */
	
 	it("Load-balancer will get three 500 errors and test will assert that the load-balancer will respond with a 500 status code", function(done) {
 		request.createClient(url).post(allocateStream, {
			"channelId":"tv3",
			"serverDestiny": [500,500,500]
		}, function(error, resFromServer, body) {

			//console.log(body);
			//console.log(resFromServer);
			assert(body.statusCode === 500);
			done();
		});
	});
	it("Load-balancer will succeed on the second request on server case1-2.neti.systems.", function(done) {
 		request.createClient(url).post(allocateStream, {
			"channelId":"tv3",
			"serverDestiny": [200,418]
		}, function(error, resFromServer, body) {
			//console.log(body);
			assert(body.statusCode === 200 && body.lastUsedClientHost === url+"case1-2.neti.systems/");
			done();
		});
	});
	it("Next request to Load-balancer will fail on server case1-2.neti.systems.", function(done) {
 		request.createClient(url).post(allocateStream, {
			"channelId":"tv3",
			"serverDestiny": [500,500,500],
			"startIndex": 2
		}, function(error, resFromServer, body) {
			//console.log("test 3 resFromServer: ", resFromServer);
			console.log(body);
			console.log("resFromServer.statusCode === 500", resFromServer.statusCode === 500);
			console.log(body.lastUsedClientHost+" === 'case1-2.neti.systems'", body.lastUsedClientHost === url+"case1-2.neti.systems/");
			assert(body.statusCode === 500 && body.lastUsedClientHost === url+"case1-2.neti.systems/");
			done();
		});
	});

});
/*
describe('Success on second request', function() {
 	
});
*/



	/*	
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
		*/