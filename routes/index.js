var express = require('express');
var router = express.Router();
var redis = require('redis'),
	redisClient = redis.createClient();

router.get('/', function(req, res) {
	var remoteAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	var host, port;

	redisClient.get(remoteAddress, function(err, reply) {
		if (!err) {
			if (reply.indexOf(":") !== -1) {
				host = reply.substr(0, reply.indexOf(":"));
				port = reply.substr(reply.indexOf(":") + 1, reply.length);
			}
		}

		res.render('index', 
			{ 
				remoteip:  remoteAddress,
				host:      host,
				port:      port
			});
	});
});
router.post('/', function(req, res) {
	console.log(req.body);
	redisClient.set(req.body.remoteip, req.body.host + ":" + req.body.port);
	console.log(req.connection.remoteAddress);
	res.redirect('/');
});

module.exports = router;