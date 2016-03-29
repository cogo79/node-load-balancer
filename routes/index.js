"use strict";

var express = require('express');
var async = require('Async');
var router = express.Router();
var serverDestiny = require('./serverDestiny');
var request = require("request-json");

var sharpVideoServerClients = [];
sharpVideoServerClients.push(request.createClient('http://case1-1.neti.systems:3000/'));
sharpVideoServerClients.push(request.createClient('http://case1-2.neti.systems:3000/'));
sharpVideoServerClients.push(request.createClient('http://case1-3.neti.systems:3000/'));

var testVideoServerClients = [];
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-1.neti.systems/'));
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-2.neti.systems/'));
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-3.neti.systems/'));

var loadBalancer = require('./loadBalancer')(sharpVideoServerClients);
var loadBalancerTest = require('./loadBalancer')(testVideoServerClients);
loadBalancerTest.setTimeOut(500);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: '© Net Insight AB, load-balancer' });
});

router.post('/allocateStream', function(req, res, next) {
	loadBalancer.passOn(req, res, function loadBalancerDone(res, statusCode, body) {
		res.status(statusCode).json(body);
	});
});

router.post('/test/allocateStream', function(req, res, next) {

	serverDestiny.willHappen(req.body.serverDestiny);
	if (req.body.startIndex) {
		loadBalancerTest.setIndex(req.body.startIndex);
		delete req.body.startIndex;
	}
	// delete req.body.serverDestiny;
	loadBalancerTest.passOn(req, res, function loadBalancerTestDone(res, statusCode, body) {
		body.lastUsedClientHost = loadBalancerTest.lastUsedClientHost();
		body.statusCode = statusCode;
		if (req.body.lastTest) {
			loadBalancerTest.setIndex(0);
		}
		res.status(200).json(body);
	});
});

function createTestServer(serverName) {
	router.post('/test/'+serverName+'/allocateStream', function(req, res, next) {
		console.log("test "+serverName+" server req.body: ", req.body);
		var happened = serverDestiny.happened();
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