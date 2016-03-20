var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '© Net Insight AB, load-balancer' });
});

module.exports = router;
