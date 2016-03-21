"use strict";

var destiny = [];

function happened() {
	console.log("function happened() {");
	var happenedResult;
	if (destiny.length > 0) {
		console.log("if (destiny.length > 0) { entered");
		happenedResult = destiny.pop();
		console.log("happenedResult = destiny.pop(); "+happenedResult);
		if (typeof happenedResult === 'number') {
			console.log("if (typeof happenedResult === 'number') { entered");
			if (happenedResult === 200 || happenedResult === 418 || happenedResult === 500) {
				console.log("if (happenedResult === 200 || happenedResult === 418 || happenedResult === 500) { entered");
				return happenedResult;
			} else {
				return random();
			}
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
		else return 418;
	}
};

function willHappen(array) {
	if (Array.isArray(array)) {
		destiny = array;
		return true;
	} else {
		return false;
	}
};

module.exports = {
	happened: happened,
	willHappen: willHappen
}