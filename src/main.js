const Koa = require('koa')
const { PORT } = require('./config/port')
const userRouter = require('./router/user')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'Hello, Koa!'
  next()
})

app.use(userRouter.routes())

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
