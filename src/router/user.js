const Router = require('koa-router')

const router = new Router({
  prefix: '/users',
})

router.get('/', (ctx, next) => {
  ctx.body = 'This is User router.'
})

module.exports = router
