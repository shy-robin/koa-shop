// app/index.js 文件负责 app 业务逻辑
const Koa = require('koa')
const KoaBody = require('koa-body')
const userRouter = require('../router/user')

const app = new Koa()

app.use(KoaBody()) // 注意，koa-body 中间件应作为首个中间件，这样后面的中间件的 ctx 才能解析出 ctx.request.body
app.use(userRouter.routes())

module.exports = app
