// app/index.js 文件负责 app 业务逻辑
const Koa = require('koa')
const KoaBody = require('koa-body')
const KoaStatic = require('koa-static')
const KoaParameter = require('koa-parameter')
const router = require('../router')
const errorHandler = require('../constant/errorHandler')
const path = require('path')

const app = new Koa()

// eslint-disable-next-line no-undef
const publicPath = path.join(__dirname, '../../public')

// 开启静态服务，指定文件夹下的所有资源可以通过 http 请求进行访问
app.use(KoaStatic(publicPath))

// 注意，koa-body 中间件应作为首个中间件，这样后面的中间件的 ctx 才能解析出 ctx.request.body
app.use(
  KoaBody({
    multipart: true, // 设置支持文件格式
    formidable: {
      // eslint-disable-next-line no-undef
      uploadDir: `${publicPath}/uploads`, // 设置文件上传目录（注意，这里如果使用相对路径是相对于 process.cwd()，推荐使用绝对路径）
      keepExtensions: true, // 设置保留文件后缀名
      filter({ mimetype }) {
        // 对文件类型进行筛选
        // keep only images
        return mimetype && mimetype.includes('image')
      },
    },
  })
)

// 校验请求参数格式，注意该中间件需要放在路由的前面
app.use(KoaParameter(app))

/*
  中间件：userRouter.allowedMethods()：
  如果不加这个中间件，如果接口是get请求，而前端使用post请求，会返回 404 状态码，接口未定义;
  如果加了这个中间件，这种情况会返回405 Method Not Allowed ，提示 request method 不匹配，并在响应头返回接口支持的请求方法，更有利于调试。
  注意，在 koa 中 use() 里面只能包含一个中间件，如果要加多个中间件则需要链式调用。
*/
app.use(router.routes()).use(router.allowedMethods())

app.on('error', errorHandler) // 统一错误处理

module.exports = app
