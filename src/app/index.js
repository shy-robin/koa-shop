// app/index.js 文件负责 app 业务逻辑
const Koa = require('koa')
const userRouter = require('../router/user')

const app = new Koa()

app.use(userRouter.routes())

module.exports = app
