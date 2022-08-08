// app/index.js 文件负责 app 业务逻辑
const Koa = require('koa')
const KoaBody = require('koa-body')
const router = require('../router')
const errorHandler = require('../constant/errorHandler')
const path = require('path')

const app = new Koa()

// 注意，koa-body 中间件应作为首个中间件，这样后面的中间件的 ctx 才能解析出 ctx.request.body
app.use(
  KoaBody({
    multipart: true, // 设置支持文件格式
    formidable: {
      // eslint-disable-next-line no-undef
      uploadDir: path.join(__dirname, '../../public/uploads'), // 设置文件上传目录（注意，这里如果使用相对路径是相对于 process.cwd()，推荐使用绝对路径）
      keepExtensions: true, // 设置保留文件后缀名
    },
  })
)

/*
  中间件：userRouter.allowedMethods()：
  如果不加这个中间件，如果接口是get请求，而前端使用post请求，会返回 404 状态码，接口未定义;
  如果加了这个中间件，这种情况会返回405 Method Not Allowed ，提示 request method 不匹配，并在响应头返回接口支持的请求方法，更有利于调试。
  注意，在 koa 中 use() 里面只能包含一个中间件，如果要加多个中间件则需要链式调用。
*/
app.use(router.routes()).use(router.allowedMethods())

app.on('error', errorHandler) // 统一错误处理

module.exports = app
