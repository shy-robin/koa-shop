const dotEnv = require('dotenv')

// 将 .env 中的配置项加载到 process.env 中
dotEnv.config()

// eslint-disable-next-line no-undef
module.exports = process.env
