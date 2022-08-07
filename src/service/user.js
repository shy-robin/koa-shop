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
