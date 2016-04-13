"use strict";

var express = require('express');
var router = express.Router();
var request = require("request-json");

var sharpVideoServerClients = [];
sharpVideoServerClients.push(request.createClient('http://case1-1.neti.systems:3000/'));
sharpVideoServerClients.push(request.createClient('http://case1-2.neti.systems:3000/'));
sharpVideoServerClients.push(request.createClient('http://case1-3.neti.systems:3000/'));

var loadBalancer = require('../modules/load-balancer/loadBalancer')(sharpVideoServerClients);

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: '© Net Insight AB, load-balancer' });
});

router.post('/allocateStream', function(req, res, next) {
	loadBalancer.passOn(req, function loadBalancerDone(statusCode, body) {
		res.status(statusCode).json(body);
	});
});

module.exports = router;