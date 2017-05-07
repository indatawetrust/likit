var router = require('koa-router')();

router.get('/', async function (ctx, next) {
  ctx.body = {
    hello: "world"
  }
})
module.exports = router;
