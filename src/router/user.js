const Router = require('koa-router')
const { register, login } = require('../controller/user')
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

router.patch('/test', auth, async (ctx, next) => {
  console.log(ctx.state.user)
  ctx.body = '修改密码成功'

  await next()
})

module.exports = router
