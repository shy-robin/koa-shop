const Koa = require('koa')
const { PORT } = require('./config/port')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'Hello, Koa!'
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
