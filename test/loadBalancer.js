"use strict";

const assert = require('assert');
var request = require('request-json');

var url = 'http://localhost:3000/test/';
var allocateStream = 'allocateStream';

describe("Test load-balancer", function() {

 	it("Load-balancer will get three 500 errors and test will assert that the load-balancer will respond with a 500 status code", function(done) {
 		request.createClient(url).post(allocateStream, {
			"channelId":"tv3",
			"serverDestiny": [500,500,500]
		}, function(error, resFromServer, body) {
			assert(body.statusCode === 500);
			done();
		});
	});
	it("Load-balancer will succeed on the second request on server case1-2.neti.systems.", function(done) {
 		request.createClient(url).post(allocateStream, {
			"channelId":"tv3",
			"serverDestiny": [200,418]
		}, function(error, resFromServer, body) {
			assert(body.statusCode === 200 && body.lastUsedClientHost === url+"case1-2.neti.systems/");
			done();
		});
	});
	it("Next request to Load-balancer will fail on server case1-2.neti.systems.", function(done) {
 		request.createClient(url).post(allocateStream, {
			"channelId":"tv3",
			"serverDestiny": [418,418,500]
		}, function(error, resFromServer, body) {
			assert(body.statusCode === 500 && body.lastUsedClientHost === url+"case1-2.neti.systems/");
			done();
		});
	});
	it("Load-balancer will get successfull response on second try on server case1-1.neti.systems.", function(done) {
 		request.createClient(url).post(allocateStream, {
			"channelId":"tv3",
			"serverDestiny": [200,500]
		}, function(error, resFromServer, body) {
			assert(body.statusCode === 200 && body.lastUsedClientHost === url+"case1-1.neti.systems/");
			done();
		});
	});
	it("Load-balancers first request succeeds on server case1-2.neti.systems.", function(done) {
 		request.createClient(url).post(allocateStream, {
			"channelId":"tv3",
			"serverDestiny": [200],
			"lastTest": true
		}, function(error, resFromServer, body) {
			assert(body.statusCode === 200 && body.lastUsedClientHost === url+"case1-2.neti.systems/");
			done();
		});
	});

});
/*
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