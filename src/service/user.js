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

  async updatePasswordById(id, password) {
    const rst = await User.update(
      { password },
      {
        where: {
          id,
        },
      }
    )
    return rst[0] > 0
  }
}

module.exports = new UserService()
