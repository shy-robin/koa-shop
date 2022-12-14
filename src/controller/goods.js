const path = require('path')
const {
  UNSUPPORTED_FILE_TYPE,
  VERIFY_PARAMS_FAILED,
  CREATE_GOODS_FAILED,
  ID_IS_NULL,
  REMOVE_GOODS_FAILED,
  RESTORE_GOODS_FAILED,
} = require('../constant/error')
const {
  create: createGoods,
  remove: removeGoods,
  restore: restoreGoods,
} = require('../service/goods')

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

  async create(ctx, next) {
    try {
      ctx.verifyParams({
        name: 'string',
        count: 'number',
        price: 'number',
      })
    } catch (error) {
      VERIFY_PARAMS_FAILED.result = error.errors
      return ctx.app.emit('error', VERIFY_PARAMS_FAILED, ctx)
    }

    try {
      const { name, count, price } = ctx.request.body
      // eslint-disable-next-line no-unused-vars
      const { updatedAt, createdAt, ...rest } = await createGoods({
        name,
        count,
        price,
      })

      ctx.body = {
        code: 0,
        message: '创建成功',
        result: rest,
      }
    } catch (error) {
      return ctx.app.emit('error', CREATE_GOODS_FAILED, ctx)
    }

    await next()
  }

  async remove(ctx, next) {
    const { id } = ctx.request.params
    if (!id) {
      return ctx.app.emit('error', ID_IS_NULL, ctx)
    }
    try {
      const rst = await removeGoods(id)
      if (!rst) {
        return ctx.app.emit('error', REMOVE_GOODS_FAILED, ctx)
      }
      ctx.body = {
        code: 0,
        message: '删除成功',
        result: {
          id,
        },
      }
    } catch (error) {
      return ctx.app.emit('error', REMOVE_GOODS_FAILED, ctx)
    }
    await next()
  }

  async restore(ctx, next) {
    const { id } = ctx.request.params
    if (!id) {
      return ctx.app.emit('error', ID_IS_NULL, ctx)
    }
    try {
      const rst = await restoreGoods(id)
      if (!rst) {
        return ctx.app.emit('error', RESTORE_GOODS_FAILED, ctx)
      }
      ctx.body = {
        code: 0,
        message: '恢复成功',
        result: {
          id,
        },
      }
    } catch (error) {
      return ctx.app.emit('error', RESTORE_GOODS_FAILED, ctx)
    }

    await next()
  }
}

module.exports = new GoodsController()
