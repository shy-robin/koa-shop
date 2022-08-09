const Router = require('koa-router')
const { auth, checkAdminPermission } = require('../middleware/authorization')
const { upload, create, remove } = require('../controller/goods')

const router = new Router({
  prefix: '/goods',
})

router.post('/upload', auth, checkAdminPermission, upload)

router.post('/', auth, checkAdminPermission, create)

router.delete('/:id', auth, checkAdminPermission, remove)

module.exports = router
