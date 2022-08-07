// main.js 文件负责 http 服务
const { APP_PORT } = require('./config')
const app = require('./app/index')

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}.`)
})
