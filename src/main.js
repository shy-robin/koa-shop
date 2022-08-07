// main.js 文件负责 http 服务
const { PORT } = require('./config')
const app = require('./app/index')

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
