const fs = require('fs')
const Router = require('koa-router')

const router = new Router()

// eslint-disable-next-line no-undef
fs.readdirSync(__dirname).forEach((file) => {
  // 自动加载所有路由
  if (file === 'index.js') return
  const r = require('./' + file)
  router.use(r.routes())
})

module.exports = router
