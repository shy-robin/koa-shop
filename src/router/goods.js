const Router = require('koa-router')
const { auth, checkAdminPermission } = require('../middleware/authorization')
const { upload, create, remove, restore } = require('../controller/goods')

const router = new Router({
  prefix: '/goods',
})

// 上传图片
router.post('/upload', auth, checkAdminPermission, upload)

// 创建商品
router.post('/', auth, checkAdminPermission, create)

// 下架商品
router.delete('/:id/sale', auth, checkAdminPermission, remove)

// 上架商品
router.patch('/:id/sale', auth, checkAdminPermission, restore)

module.exports = router
