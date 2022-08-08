const Good = require('../model/goods')

class GoodsService {
  async create({ name, count, price }) {
    const rst = await Good.create({
      name,
      count,
      price,
    })

    return rst.dataValues
  }
}

module.exports = new GoodsService()
