var router = require('koa-router')();

let count = 0

router.get('/', async function (ctx, next) {

  if (count++>5) throw 1

  ctx.body = {
    hello: "world"
  }
})
module.exports = router;
