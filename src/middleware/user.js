const { queryUser } = require('../service/user')

/**
 * 验证请求参数是否为空
 */
const validateParamsNotNull = async (ctx, next) => {
  const { userName, password } = ctx.request.body

  if (!userName || !password) {
    ctx.status = 400 // 400 Bad Request
    ctx.body = {
      code: 10001,
      message: '用户名或密码为空',
      result: '',
    }
    return
  }

  await next()
}

/**
 * 验证用户名是否已存在
 */
const validateUserNameUnique = async (ctx, next) => {
  const { userName } = ctx.request.body

  if (await queryUser({ userName })) {
    // 注意 queryUser 是一个 Promise，需要 await 结果
    ctx.status = 409 // 409 Conflict
    ctx.body = {
      code: 10002,
      message: '用户名已存在',
      result: '',
    }
    return
  }

  await next()
}

module.exports = {
  validateParamsNotNull,
  validateUserNameUnique,
}
