class UserController {
  async register(ctx, next) {
    ctx.body = 'Register'
  }
  async login(ctx, next) {
    ctx.body = 'Login'
  }
}

module.exports = new UserController()
