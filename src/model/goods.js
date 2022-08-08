const { DataTypes } = require('sequelize')
const seq = require('../db')

const Good = seq.define('Good', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '商品名称',
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '商品数量',
  },
  price: {
    type: DataTypes.DECIMAL(2),
    allowNull: false,
    comment: '商品价格',
  },
})

Good.sync()

module.exports = Good
