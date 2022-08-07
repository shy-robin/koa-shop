module.exports = (error, ctx) => {
  switch (error.code) {
    case 10001:
      ctx.status = 400 // 400 Bad Request
      break
    case 10002:
      ctx.status = 409 // 409 Conflict
      break
    default:
      ctx.status = 500
      break
  }
  ctx.body = error
}
