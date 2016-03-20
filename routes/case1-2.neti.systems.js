var express = require('express');
var router = express.Router();
var serverDestiny = require('./serverDestiny');

router.get('/', function(req, res, next) {
	res.send('case1-2.neti.systems');
});

router.post('/', function(req, res, next) {
	console.log("10 case2 server req.body: ", req.body);
	var happened = serverDestiny.happened();
	switch(happened) {
		case 500:
			res.sendStatus(happened);
			break;
		case 418:
			setTimeout(respond, 3000);
			break;
		default:
			respond();
	}
	//res.sendStatus(serverDestiny.happened());
	function respond() {
		res.send({
			"url": "http://video1.neti.systems/" + req.body.channelId + "?token=12345",
			"secret": "abcdef"
		});
	};
});

module.exports = router;
