const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'Hello, Koa!'
})

app.listen(3000, () => {
  console.log('Server is running on port 3000...')
})
