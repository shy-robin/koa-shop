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
  async remove(id) {
    const rst = await Good.destroy({
      where: {
        id,
      },
    })
    return rst > 0
  }
}

module.exports = new GoodsService()
