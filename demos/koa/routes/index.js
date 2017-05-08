var router = require('koa-router')();

router.get('/', function *(next) {
  yield this.body = {
    hello: "world"
  }
});

module.exports = router;
