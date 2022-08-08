const Router = require('koa-router')

const router = new Router({
  prefix: '/goods',
})

router.get('/', async (ctx, next) => {
  ctx.body = {
    code: 0,
    message: 'get goods',
    result: '',
  }
  await next()
})

module.exports = router
