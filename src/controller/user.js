const { createUser, queryUser } = require('../service/user')

class UserController {
  async register(ctx, next) {
    // 1. 读取请求参数
    const { userName, password } = ctx.request.body

    // #region 错误处理
    // 合法性
    if (!userName || !password) {
      ctx.status = 400 // 400 Bad Request
      ctx.body = {
        code: 10001,
        message: '用户名或密码为空',
        result: '',
      }
      return
    }
    // 合理性
    if (queryUser({ userName })) {
      ctx.status = 409 // 409 Conflict
      ctx.body = {
        code: 10002,
        message: '用户名已存在',
        result: '',
      }
      return
    }

    // #endregion

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
  }
  async login(ctx, next) {
    ctx.body = 'Login'
  }
}

module.exports = new UserController()
