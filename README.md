# Koa Shop

> 项目参考：https://github.com/jj112358/node-api

## 一、项目初始化

### 1. npm 初始化

`npm init`

### 2. git 初始化

`git init`

### 3. README 文件

`touch README.md`

## 二、项目搭建

### 1. 安装 Koa

`npm install koa`

### 2. 编写基本模版

`src/main.js`

```js
const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
  ctx.body = 'Hello, Koa!'
})

app.listen(3000, () => {
  console.log('Server is running on port 3000...')
})

```

### 3. 运行模版

`node src/main.js`

> 可以利用 vscode 插件 RestClient，进行接口测试。

## 三、项目基本优化

### 1. 自动重启服务

1. 安装 nodemon
   `npm i nodemon -D`

2. 编辑 package.json 中的 scripts

   ```json
     "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1",
       "dev": "nodemon ./src/main.js"
     },
   ```

3. 重启服务
   `npm run dev`

### 2. 读取配置文件

1. 安装 dotenv
   `npm i dotenv`

2. 在根目录下创建 .env 文件，并写入：

   ```
   PORT=3100
   ```

3. 创建 src/config/port.js 文件，并写入：

   ```js
   const dotEnv = require('dotenv')
   
   // 将 .env 中的配置项加载到 process.env 中
   dotEnv.config()
   
   module.exports = process.env
   
   ```

4. 改写 src/main.js 入口文件：

   ```js
   const Koa = require('koa')
   const { PORT } = require('./config/port')
   
   const app = new Koa()
   
   app.use((ctx, next) => {
     ctx.body = 'Hello, Koa!'
   })
   
   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}.`)
   })
   
   ```

## 四、编写路由

1. 安装 koa-router
   `npm i koa-router`

2. 创建 src/router/user.js 文件，并写入：

   ```js
   const Router = require('koa-router')
   
   const router = new Router({
     prefix: '/users'
   })
   
   router.get('/', (ctx, next) => {
     ctx.body = 'This is Users router.'
   })
   
   module.exports = router
   
   ```

3. 改写 src/main.js 文件：

   ```js
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
   
   ```

4. 在 api.rest 文件中测试：

   ```
   @baseUrl = http://localhost:3100
   ###
   GET {{baseUrl}}
   
   ###
   GET {{baseUrl}}/users
   ```

## 五、目录结构优化

### 1. 拆分 http 服务和 app 业务

原来 main.js 入口文件中包含 http 服务和 app 业务逻辑，结构不够清晰，因此可以做拆分。

修改 main.js :

```js
// main.js 文件负责 http 服务
const { PORT } = require('./config/port')
const app = require('./app/index')

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})

```

创建 src/app/index.js 文件，并写入：

```js
// app/index.js 文件负责 app 业务逻辑
const Koa = require('koa')
const userRouter = require('./router/user')

const app = new Koa()

app.use(userRouter.routes())

module.exports = app

```



