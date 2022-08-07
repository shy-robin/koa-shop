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

### 3. 解析 body

1. 安装 koa-body
   `npm i koa-body`

2. 修改 src/app/index.js

   ```js
   // app/index.js 文件负责 app 业务逻辑
   const Koa = require('koa')
   const KoaBody = require('koa-body')
   const userRouter = require('../router/user')
   
   const app = new Koa()
   
   app.use(KoaBody()) // 注意，koa-body 中间件应作为首个中间件，这样后面的中间件的 ctx 才能解析出 ctx.request.body
   app.use(userRouter.routes())
   
   module.exports = app
   
   ```

3. 在中间件中使用解析得到的 body

   ```js
   async register(ctx, next) {
     const { userName, password } = ctx.request.body
     console.log(userName, password)
     ctx.body = 'Register'
   }
   ```

4. 在 api.rest 中测试

   ```
   ###
   POST {{baseUrl}}/users/register
   Content-Type: application/json
   
   {
     "userName": "ShyRobin",
     "password": "test.password"
   }
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

### 2. 拆分 router 和 controller

路由：解析不同的 url，不同的请求方法对应不同的控制器；

控制器: 处理不同的业务。

src/router/user.js

```js
const Router = require('koa-router')
const { register, login } = require('../controller/user')

const router = new Router({
  prefix: '/users',
})

router.get('/register', register)

router.get('/login', login)

module.exports = router

```

src/controller/user.js

```js
class UserController {
  async register(ctx, next) {
    ctx.body = 'Register'
  }
  async login(ctx, next) {
    ctx.body = 'Login'
  }
}

module.exports = new UserController()

```

### 3. 拆分 controller 和 service

service 层主要是包含数据库处理逻辑。

创建 src/service/user.js 文件，并写入：

```js
class UserService {
  async createUser(userName, password) {
    // TODO: 数据库操作
    return true
  }
}

module.exports = new UserService()

```

改写 src/controller/user.js 文件：

```js
const { createUser } = require('../service/user')

class UserController {
  async register(ctx, next) {
    const { userName, password } = ctx.request.body
    const result = createUser(userName, password)
    ctx.body = result
  }
  async login(ctx, next) {
    ctx.body = 'Login'
  }
}

module.exports = new UserController()

```

## 六、数据库

### 1. 安装 mysql

根据系统，安装对应的 mysql。

修改 root 密码：

`mysqladmin -uroot -p[oldPassword] password [newPassword]`

> 注意，如果出现 warning，不用理会，密码依旧修改成功了。

### 2. 集成 sequelize

sequelize：一个 ORM 数据库工具；

官网：https://sequelize.org/docs/v6/getting-started/

ORM: 对象关系映射：

- 数据表映射(对应)一个类；
- 数据表中的数据行(记录)对应一个对象；
- 数据表字段对应对象的属性；
- 数据表的操作对应对象的方法。

1. 安装相应依赖
   `npm install --save sequelize mysql2`

2. 创建 src/db/index.js，连接数据库：

   ```js
   const { Sequelize } = require('sequelize')
   
   const {
     MYSQL_HOST,
     MYSQL_PORT,
     MYSQL_USER,
     MYSQL_PWD,
     MYSQL_DB,
   } = require('../config/config.default')
   
   const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
     host: MYSQL_HOST,
     port: MYSQL_PORT,
     dialect: 'mysql',
   })
   
   seq
     .authenticate()
     .then(() => {
       console.log('数据库连接成功')
     })
     .catch((err) => {
       console.log('数据库连接失败', err)
     })
   
   module.exports = seq
   
   ```

3. 编写配置：

   ```
   APP_PORT=3100
   
   MYSQL_HOST = localhost
   MYSQL_PORT = 3306
   MYSQL_USER = root
   MYSQL_PWD = ******
   MYSQL_DB = KoaShop
   ```

4. 测试代码：
   `node src/db/index.js`
