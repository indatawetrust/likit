var express = require('express');
var router = express.Router();

var count = 0;

router.get('/', function(req, res, next) {

  if (count++ > 5) throw { "error": "message" }

  res.json({
    hello: "world"
  })
});

module.exports = router;
