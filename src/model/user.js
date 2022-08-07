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
