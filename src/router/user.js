const Router = require('koa-router')
const { register, login } = require('../controller/user')
const {
  validateParamsNotNull,
  validateUserNameUnique,
  encryptPassword,
} = require('../middleware/user')

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

router.get('/login', login)

module.exports = router
