"use strict";
var request = require("request-json");

var defaultIndex = 0;
var defaultVideoServerClients = [];
defaultVideoServerClients.push(request.createClient('http://case1-1.neti.systems:3000/'));
defaultVideoServerClients.push(request.createClient('http://case1-2.neti.systems:3000/'));
defaultVideoServerClients.push(request.createClient('http://case1-3.neti.systems:3000/'));

var testIndex = 0;
var testVideoServerClients = [];
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-1.neti.systems/'));
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-2.neti.systems/'));
testVideoServerClients.push(request.createClient('http://localhost:3000/test/case1-3.neti.systems/'));

var clients = defaultVideoServerClients;

var currentClientIndex = defaultIndex;
function nextClient() {
	var i = currentClientIndex;
	if (currentClientIndex <= 1) {
		currentClientIndex++;
	} else {
		currentClientIndex = 0;
	}
	console.log("Will make request to server " + clients[i].host);
	return clients[i];
}

function whatsGoingOn() {
	console.log(clients[0].host);
	console.log(clients[1].host);
	console.log(clients[2].host);
}

function setToTestMode() {
	currentClientIndex = testIndex;
	clients = testVideoServerClients;
}

function setSharpMode() {
	currentClientIndex = defaultIndex;
	testIndex = 0;
	clients = defaultVideoServerClients;
}

module.exports = {
	nextClient: nextClient,
	setToTestMode: setToTestMode,
	setSharpMode: setSharpMode,
	whatsGoingOn: whatsGoingOn
}

