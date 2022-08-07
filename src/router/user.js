const Router = require('koa-router')
const { register, login, changePassword } = require('../controller/user')
const {
  validateParamsNotNull,
  validateUserNameUnique,
  encryptPassword,
} = require('../middleware/user')
const { auth } = require('../middleware/authorization')

const router = new Router({
  prefix: '/users',
})

router.post(
  '/register',
  validateParamsNotNull,
  validateUserNameUnique,
  encryptPassword,
  register
)

router.post('/login', validateParamsNotNull, login)

// RESTful API patch 表示部分更新
router.patch('/', auth, changePassword)

module.exports = router
