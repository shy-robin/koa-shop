const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const {
  TOKEN_EXPIRED,
  TOKEN_INVALID,
  TOKEN_NOT_EXISTS,
  NO_ADMIN_PERMISSION,
} = require('../constant/error')

/**
 * 用户认证
 */
const auth = async (ctx, next) => {
  // 从请求头中解析出 token
  const { authorization } = ctx.request.header
  if (!authorization) {
    return ctx.app.emit('error', TOKEN_NOT_EXISTS, ctx)
  }
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

/**
 * 验证用户是否有管理员权限
 */
const checkAdminPermission = async (ctx, next) => {
  const { isAdmin } = ctx.state.user
  if (!isAdmin) {
    return ctx.app.emit('error', NO_ADMIN_PERMISSION, ctx)
  }
  await next()
}

module.exports = { auth, checkAdminPermission }
