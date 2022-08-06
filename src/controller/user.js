const { createUser } = require('../service/user')

class UserController {
  async register(ctx, next) {
    const { userName, password } = ctx.request.body
    const result = createUser(userName, password)
    ctx.body = result
  }
  async login(ctx, next) {
    ctx.body = 'Login'
  }
}

module.exports = new UserController()
