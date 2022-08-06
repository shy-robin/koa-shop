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



