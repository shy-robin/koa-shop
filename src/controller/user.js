const { createUser } = require('../service/user')
const { CREATE_USER_ERROR } = require('../constant/error')

class UserController {
  async register(ctx, next) {
    // 1. 读取请求参数
    const { userName, password } = ctx.request.body
    try {
      // 2. 操作数据库
      const rst = await createUser(userName, password)
      // 3. 返回响应结果
      ctx.body = {
        code: 0,
        message: '用户注册成功',
        result: {
          id: rst.id,
          userName: rst.userName,
        },
      }
    } catch (error) {
      ctx.app.emit('error', CREATE_USER_ERROR, ctx)
      return
    }

    await next()
  }
  async login(ctx, next) {
    ctx.body = 'Login'

    await next()
  }
}

module.exports = new UserController()
