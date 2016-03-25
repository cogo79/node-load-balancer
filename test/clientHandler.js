const assert = require('assert');

describe('supertest test', function() {
	
	before(function(done) {

		done();
	});
	after(function(done) {
		
		done();
	});
 	it('Test if mocha and supertest works any good for my load-balancer', function(done) {
 		var a = "mocha and supertest works really well when testing http requests";
 		var b = "Really?"
		assert(a === b);
		done();
	});
});
