const path = require('path')

class GoodsController {
  async upload(ctx, next) {
    const { file } = ctx.request.files
    ctx.body = {
      code: 0,
      message: '上传成功',
      result: {
        path: `${ctx.origin}/uploads/${path.basename(file.filepath)}`,
      },
    }
    await next()
  }
}

module.exports = new GoodsController()
