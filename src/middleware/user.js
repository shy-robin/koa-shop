const bcrypt = require('bcryptjs')
const { queryUser } = require('../service/user')
const {
  USER_PARAMS_NULL,
  USER_NAME_EXISTED,
  QUERY_USER_ERROR,
} = require('../constant/error')

/**
 * 验证请求参数是否为空
 */
const validateParamsNotNull = async (ctx, next) => {
  const { userName, password } = ctx.request.body

  if (!userName || !password) {
    ctx.app.emit('error', USER_PARAMS_NULL, ctx)
    return
  }

  await next()
}

/**
 * 验证用户名是否已存在
 */
const validateUserNameUnique = async (ctx, next) => {
  const { userName } = ctx.request.body

  try {
    if (await queryUser({ userName })) {
      // 注意 queryUser 是一个 Promise，需要 await 结果
      ctx.app.emit('error', USER_NAME_EXISTED, ctx)
      return
    }
  } catch (error) {
    ctx.app.emit('error', QUERY_USER_ERROR, ctx)
    return
  }

  await next()
}

/**
 * 加密密码
 */
const encryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body

  var salt = bcrypt.genSaltSync(10) // 加盐
  var hash = bcrypt.hashSync(password, salt)

  ctx.request.body.password = hash

  await next()
}

module.exports = {
  validateParamsNotNull,
  validateUserNameUnique,
  encryptPassword,
}
