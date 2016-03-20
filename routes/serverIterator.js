"use strict";

var servers = ['case1-1.neti.systems', 'case1-2.neti.systems', 'case1-3.neti.systems'];
var currentServerIndex = 0;
function getServer() {
	var i = currentServerIndex;
	if (currentServerIndex <= 1) {
		currentServerIndex++;
	} else {
		currentServerIndex = 0;
	}
	console.log("Will make request to server " + servers[i]);
	return servers[i];
}

module.exports = {
	getServer: getServer
}