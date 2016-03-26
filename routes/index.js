var express = require('express');
var router = express.Router();
var loadBalancer = require('./loadBalancer');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: '© Net Insight AB, load-balancer' });
});

router.post('/allocateStream', function(req, res, next) {
	loadBalancer.passOn(req, res);
});

module.exports = router;