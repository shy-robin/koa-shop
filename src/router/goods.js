const Router = require('koa-router')
const { auth, checkAdminPermission } = require('../middleware/authorization')
const { upload } = require('../controller/goods')

const router = new Router({
  prefix: '/goods',
})

router.post('/upload', auth, checkAdminPermission, upload)

module.exports = router
