var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Net Insight AB, load balancer');
});

module.exports = router;
