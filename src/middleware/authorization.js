const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const { TOKEN_EXPIRED, TOKEN_INVALID } = require('../constant/error')

/**
 * 用户认证
 */
const auth = async (ctx, next) => {
  // 从请求头中解析出 token
  const { authorization } = ctx.request.header
  if (!authorization) return
  const token = authorization.replace('Bearer ', '')

  try {
    // 验证 token，并获取到 token 中的 payload 信息
    const user = jwt.verify(token, JWT_SECRET)
    ctx.state.user = user
  } catch (error) {
    switch (error.name) {
      case 'TokenExpiredError':
        return ctx.app.emit('error', TOKEN_EXPIRED, ctx)
      case 'JsonWebTokenError':
        return ctx.app.emit('error', TOKEN_INVALID, ctx)
    }
  }

  await next()
}

module.exports = { auth }
