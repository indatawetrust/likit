var router = require('koa-router')();

var a = {
  b: 1
}

var count = 1

router.get('/', function *(next) {
  count++

  if (count>5) throw 1

  this.body = a.b

});

module.exports = router;
