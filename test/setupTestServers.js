
function setupTestServers(app) {
	var case1 = require('./routes/case1-1.neti.systems');
	var case2 = require('./routes/case1-2.neti.systems');
	var case3 = require('./routes/case1-3.neti.systems');
	app.use('/test/case1-1.neti.systems', case1);
	app.use('/test/case1-2.neti.systems', case2);
	app.use('/test/case1-3.neti.systems', case3);
	var testLoadBalancer = require('./routes/testLoadBalancer');
	app.use('/test/testLoadBalancer', testLoadBalancer);
}

module.exports = {
	setupTestServers: setupTestServers
};
