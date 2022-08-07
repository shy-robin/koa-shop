const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createUser, queryUser } = require('../service/user')
const {
  CREATE_USER_ERROR,
  USER_NAME_NOT_EXISTED,
  QUERY_USER_ERROR,
  PASSWORD_INCORRECT,
} = require('../constant/error')
const { JWT_SECRET } = require('../config')

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
    const { userName, password } = ctx.request.body

    try {
      // 判断是否存在用户名
      const user = await queryUser({ userName })
      if (!user) {
        return ctx.app.emit('error', USER_NAME_NOT_EXISTED, ctx)
      }

      // 判断密码是否匹配
      const isPasswordSame = bcrypt.compareSync(password, user.password)
      if (!isPasswordSame) {
        return ctx.app.emit('error', PASSWORD_INCORRECT, ctx)
      }

      // 登录成功，颁发 token
      ctx.body = {
        code: 0,
        message: `登录成功，${userName}`,
        result: {
          // 在 token 的 payload 中记录 id, userName, isAdmin 信息
          token: jwt.sign(
            {
              id: user.id,
              userName: user.userName,
              isAdmin: user.isAdmin,
            },
            JWT_SECRET,
            { expiresIn: '1d' }
          ),
        },
      }
    } catch (error) {
      return ctx.app.emit('error', QUERY_USER_ERROR, ctx)
    }

    await next()
  }
}

module.exports = new UserController()
