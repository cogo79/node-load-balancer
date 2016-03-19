"use strict";

var destiny = [];

function happened() {
	var happenedResult;
	if (destiny.length > 0) {
		happenedResult = destiny.pop();
		if (typeof happenedResult === 'number' && happenedResult <=3 && happenedResult > 0) {
			return happenedResult;
		} else {
			return random();
		}
	} else {
		return random();
	}
	function random() {
		var happenedResult = Math.random();
		if (happenedResult < 0.333) return 200;
		else if (happenedResult > 0.666) return 500;
		else return 408;
	}
};

function willHappen(array) {
	if (Array.isArray(array)) {
		willHappen = array;
		return true;
	} else {
		return false;
	}
};

module.exports = {
	happened: happened
}