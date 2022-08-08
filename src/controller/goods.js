class GoodsController {
  async upload(ctx, next) {
    ctx.body = {
      code: 0,
      message: '上传成功',
      result: '',
    }
    await next()
  }
}

module.exports = new GoodsController()
