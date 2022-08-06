class UserController {
  async register(ctx, next) {
    const { userName, password } = ctx.request.body
    console.log(userName, password)
    ctx.body = 'Register'
  }
  async login(ctx, next) {
    ctx.body = 'Login'
  }
}

module.exports = new UserController()
