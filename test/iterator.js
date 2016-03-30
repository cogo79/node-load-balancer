"use strict";

const assert = require('assert');

var iterator = require('../routes/iterator')(["foo", "baz", "car", "jar"]);

describe("Test iterator", function() {

 	it("Check that getNext function is working", function(done) {
 		iterator.getNext();
 		iterator.getNext();
 		var car = iterator.getNext();
 		assert(car === "car");
 		done();
	});
	it("Check that getNext function starts all over on first index after geting whats in the end of its array.", function(done) {
 		iterator.getNext();
 		iterator.getNext();
 		var baz = iterator.getNext();
 		assert(baz === "baz");
 		done();
	});
	it("Check that function 'getPrevious' works as expekted after seting new index.", function(done) {
		iterator.setIndex(0);
 		assert(iterator.getPrevious() === "baz");
 		done();
	});
	it("Check that function 'setIndex' only accepts integers.", function(done) {
		iterator.setIndex(3);
		iterator.setIndex("0");
		var index = iterator.getCurrentIndex();
 		assert(index === 3);
 		done();
	});
	it("Check that function 'setIndex' does not accept integer that is bigger than the last array index number.", function(done) {
		iterator.setIndex(2);
		iterator.setIndex(4);
		var index = iterator.getCurrentIndex();
		assert(index === 2);
 		done();
	});
	it("Check that function 'setIndex' does not accept integer that is lesser than the first array index number.", function(done) {
		iterator.setIndex(2);
		iterator.setIndex(-1);
		var index = iterator.getCurrentIndex();
		assert(index === 2);
 		done();
	});
});
