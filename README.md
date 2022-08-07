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
     prefix: '/users',
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

### 3. 拆分 Model 层

sequelize 主要通过 Model 层对应数据表，详见：https://sequelize.org/docs/v6/core-concepts/model-basics/。

创建 src/model/user.js 文件并写入：

```js
const { DataTypes } = require('sequelize')
const seq = require('../db/index')

// 创建模型(模型名 User  -> 表名 Users)
const User = seq.define('User', {
  // id 会被 sequelize 自动创建并管理
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名，非空，唯一',
  },
  password: {
    type: DataTypes.CHAR(64),
    allowNull: false,
    comment: '密码，非空',
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
    comment: '是否为管理员：0（否），1（是）',
  },
})

// 强制同步（如果存在表则覆盖，不存在则新建）
User.sync({
  force: true,
})

module.exports = User
```

### 4. 添加数据操作

所有关于数据库的操作逻辑都应放在 service 中，service 调用 model 层完成对数据库的操作。

改写 src/service/user.js ：

```js
const User = require('../model/user')

class UserService {
  async createUser(userName, password) {
    const rst = await User.create({
      userName,
      password,
    })
    return rst.dataValues
  }
}

module.exports = new UserService()
```

改写 src/controller/user.js :

```js
const { createUser } = require('../service/user')

class UserController {
  async register(ctx, next) {
    // 1. 读取请求参数
    const { userName, password } = ctx.request.body
    // 2. 操作数据库
    const rst = await createUser(userName, password)
    // 3. 返回响应结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: rst.id,
        userName: rst.userName,
      },
    }
  }
  async login(ctx, next) {
    ctx.body = 'Login'
  }
}

module.exports = new UserController()
```

利用 rest client 插件进行测试。

### 5. 错误处理

在 src/controller/user.js 中，增加对请求参数的校验，如果请求参数为空，返回对应的错误响应；如果操作数据已存在，也返回对应的错误响应。

```js
const { createUser, queryUser } = require('../service/user')

class UserController {
  async register(ctx, next) {
    // 1. 读取请求参数
    const { userName, password } = ctx.request.body

    // #region 错误处理
    // 合法性
    if (!userName || !password) {
      ctx.status = 400 // 400 Bad Request
      ctx.body = {
        code: 10001,
        message: '用户名或密码为空',
        result: '',
      }
      return
    }
    // 合理性
    if (queryUser({ userName })) {
      ctx.status = 409 // 409 Conflict
      ctx.body = {
        code: 10002,
        message: '用户名已存在',
        result: '',
      }
      return
    }

    // #endregion

    // 2. 操作数据库
    const rst = await createUser(userName, password)
    // 3. 返回响应结果
    ctx.body = {
      code: 0,
      message: '用户注册成功',
      result: {
        id: rst.id,
        userName: rst.userName,
      },
    }
  }
  async login(ctx, next) {
    ctx.body = 'Login'
  }
}

module.exports = new UserController()
```

在 src/service/user.js 中增加查询用户的操作：

```js
const User = require('../model/user')

class UserService {
  async createUser(userName, password) {
    const rst = await User.create({
      userName,
      password,
    })
    return rst.dataValues
  }
  async queryUser({ id, userName, password, isAdmin }) {
    const whereOpt = {}

    id && Object.assign(whereOpt, { id })
    userName && Object.assign(whereOpt, { userName })
    password && Object.assign(whereOpt, { password })
    isAdmin && Object.assign(whereOpt, { isAdmin })

    const rst = await User.findOne({
      attributes: ['id', 'userName', 'password', 'isAdmin'],
      where: whereOpt,
    })

    return rst ? rst.dataValues : null
  }
}

module.exports = new UserService()
```

### 6. 拆分中间件

为了使代码的逻辑更加清晰，同时复用一些代码，我们可以拆分一个中间件层，封装多个中间件函数。

创建 src/middleware/user.js ，并写入：

```js
const { queryUser } = require('../service/user')

/**
 * 验证请求参数是否为空
 */
const validateParamsNotNull = async (ctx, next) => {
  const { userName, password } = ctx.request.body

  if (!userName || !password) {
    ctx.status = 400 // 400 Bad Request
    ctx.body = {
      code: 10001,
      message: '用户名或密码为空',
      result: '',
    }
    return
  }

  await next()
}

/**
 * 验证用户名是否已存在
 */
const validateUserNameUnique = async (ctx, next) => {
  const { userName } = ctx.request.body

  if (await queryUser({ userName })) {
    // 注意 queryUser 是一个 Promise，需要 await 结果
    ctx.status = 409 // 409 Conflict
    ctx.body = {
      code: 10002,
      message: '用户名已存在',
      result: '',
    }
    return
  }

  await next()
}

module.exports = {
  validateParamsNotNull,
  validateUserNameUnique,
}
```

改写 src/router/user.js 文件：

```js
const Router = require('koa-router')
const { register, login } = require('../controller/user')
const {
  validateParamsNotNull,
  validateUserNameUnique,
} = require('../middleware/user')

const router = new Router({
  prefix: '/users',
})

router.post(
  '/register',
  validateParamsNotNull,
  validateUserNameUnique,
  register
)

router.get('/login', login)

module.exports = router
```

测试。

### 7. 统一错误处理

编写统一错误响应文件 src/constant/error.js :

```js
module.exports = {
  USER_PARAMS_NULL: {
    code: 10001,
    message: '用户名或密码为空',
    result: '',
  },
  USER_NAME_EXISTED: {
    code: 10002,
    message: '用户名已存在',
    result: '',
  },
}
```

改写 src/middleware/user.js 文件：

```js
const { queryUser } = require('../service/user')
const { USER_PARAMS_NULL, USER_NAME_EXISTED } = require('../constant/error')

/**
 * 验证请求参数是否为空
 */
const validateParamsNotNull = async (ctx, next) => {
  const { userName, password } = ctx.request.body

  if (!userName || !password) {
    // ctx.status = 400 // 400 Bad Request
    // ctx.body = {
    //   code: 10001,
    //   message: '用户名或密码为空',
    //   result: '',
    // }
    ctx.app.emit('error', USER_PARAMS_NULL, ctx)
    return
  }

  await next()
}

/**
 * 验证用户名是否已存在
 */
const validateUserNameUnique = async (ctx, next) => {
  const { userName } = ctx.request.body

  if (await queryUser({ userName })) {
    // 注意 queryUser 是一个 Promise，需要 await 结果
    // ctx.status = 409 // 409 Conflict
    // ctx.body = {
    //   code: 10002,
    //   message: '用户名已存在',
    //   result: '',
    // }
    ctx.app.emit('error', USER_NAME_EXISTED, ctx)
    return
  }

  await next()
}

module.exports = {
  validateParamsNotNull,
  validateUserNameUnique,
}
```

改写 src/app/index.js 文件：

```js
// app/index.js 文件负责 app 业务逻辑
const Koa = require('koa')
const KoaBody = require('koa-body')
const userRouter = require('../router/user')
const errorHandler = require('../constant/errorHandler')

const app = new Koa()

app.use(KoaBody()) // 注意，koa-body 中间件应作为首个中间件，这样后面的中间件的 ctx 才能解析出 ctx.request.body
app.use(userRouter.routes())

app.on('error', errorHandler) // 统一错误处理

module.exports = app
```

创建 src/constant/errorHandler.js 并写入：

```js
module.exports = (error, ctx) => {
  switch (error.code) {
    case 10001:
      ctx.status = 400 // 400 Bad Request
      break
    case 10002:
      ctx.status = 409 // 409 Conflict
      break
    default:
      ctx.status = 500
      break
  }
  ctx.body = error
}
```

对于操作数据库产生的错误，应当用 try catch 语法捕获错误，并统一处理，如：

```js
  async register(ctx, next) {
    // 1. 读取请求参数
    const { userName, password } = ctx.request.body
    try {
      // 2. 操作数据库
      const rst = await createUser(userName, password)
      // 3. 返回响应结果
      ctx.body = {
        code: 0,
        message: '用户注册成功',
        result: {
          id: rst.id,
          userName: rst.userName,
        },
      }
    } catch (error) {
      ctx.app.emit('error', CREATE_USER_ERROR, ctx)
      return
    }

    await next()
  }
```

### 8. 加密处理

将密码保存到数据库之前，应当对密码进行加密处理。

这里用到 bcryptjs 库进行加密解密处理，https://www.npmjs.com/package/bcryptjs。

在 src/middleware/user.js 中封装中间件：

```js
/**
 * 加密密码
 */
const encryptPassword = async (ctx, next) => {
  const { password } = ctx.request.body

  var salt = bcrypt.genSaltSync(10) // 加盐
  var hash = bcrypt.hashSync(password, salt)

  ctx.request.body.password = hash

  await next()
}
```

在 router 中使用该中间件：

```js
router.post(
  '/register',
  validateParamsNotNull,
  validateUserNameUnique,
  encryptPassword,
  register
)
```

测试。

### 9. 颁发 token

安装 jsonwebtoken：https://www.npmjs.com/package/jsonwebtoken

`npm i jsonwebtoken`

改写 `login` 函数：

```js
  async login(ctx, next) {
    const { userName, password } = ctx.request.body

    try {
      // 判断是否存在用户名
      const user = await queryUser({ userName })
      if (!user) {
        return ctx.app.emit('error', USER_NAME_NOT_EXISTED, ctx)
      }

      // 判断密码是否匹配(注意，password 未加密， user.password 已加密)
      const isPasswordSame = bcrypt.compareSync(password, user.password)
      if (!isPasswordSame) {
        return ctx.app.emit('error', PASSWORD_INCORRECT, ctx)
      }

      // 登录成功，颁发 token
      ctx.body = {
        code: 0,
        message: `登录成功，${userName}`,
        result: {
          // 在 token 的 payload 中记录 id, userName, isAdmin 信息
          token: jwt.sign(
            {
              id: user.id,
              userName: user.userName,
              isAdmin: user.isAdmin,
            },
            JWT_SECRET,
            { expiresIn: '1d' }
          ),
        },
      }
    } catch (error) {
      return ctx.app.emit('error', QUERY_USER_ERROR, ctx)
    }

    await next()
  }
```

### 10. 用户认证

创建 src/middleware/authorization.js，写入验证 token 逻辑：

```js
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const { TOKEN_EXPIRED, TOKEN_INVALID } = require('../constant/error')

/**
 * 用户认证
 */
const auth = async (ctx, next) => {
  // 从请求头中解析出 token
  const { authorization } = ctx.request.header
  if (!authorization) return
  const token = authorization.replace('Bearer ', '')

  try {
    // 验证 token，并获取到 token 中的 payload 信息
    const user = jwt.verify(token, JWT_SECRET)
    ctx.state.user = user
  } catch (error) {
    switch (error.name) {
      case 'TokenExpiredError':
        return ctx.app.emit('error', TOKEN_EXPIRED, ctx)
      case 'JsonWebTokenError':
        return ctx.app.emit('error', TOKEN_INVALID, ctx)
    }
  }

  await next()
}

module.exports = { auth }
```

在 router 中新增 patch 接口，测试 token：

```js
router.patch('/test', auth, async (ctx, next) => {
  console.log(ctx.state.user)
  ctx.body = '修改密码成功'

  await next()
})
```

在请求中携带 token，测试响应：

```
@baseUrl = http://localhost:3100
###
GET {{baseUrl}}

### 登录
POST {{baseUrl}}/users/login
Content-Type: application/json

{
  "userName": "Mike",
  "password": "123456"
}

### 注册
POST {{baseUrl}}/users/register
Content-Type: application/json

{
  "userName": "Mike",
  "password": "123456"
}

### test
PATCH {{baseUrl}}/users/test
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlck5hbWUiOiJNaWtlIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTY1OTg2MTYxOSwiZXhwIjoxNjU5OTQ4MDE5fQ.9k2a67yjXwbZN1Onofeq43sdBSI66ftyr4vv9Q6OPvY

```
