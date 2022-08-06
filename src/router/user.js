const Router = require('koa-router')
const { register, login } = require('../controller/user')

const router = new Router({
  prefix: '/users',
})

router.get('/register', register)

router.get('/login', login)

module.exports = router
