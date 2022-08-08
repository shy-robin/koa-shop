const path = require('path')
const { UNSUPPORTED_FILE_TYPE } = require('../constant/error')

class GoodsController {
  async upload(ctx, next) {
    const {
      file: { filepath, mimetype },
    } = ctx.request.files

    if (!mimetype.includes('image')) {
      return ctx.app.emit('error', UNSUPPORTED_FILE_TYPE, ctx)
    }

    ctx.body = {
      code: 0,
      message: '上传成功',
      result: {
        path: `${ctx.origin}/uploads/${path.basename(filepath)}`,
      },
    }
    await next()
  }
}

module.exports = new GoodsController()
