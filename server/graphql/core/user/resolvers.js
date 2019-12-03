// example data

const models = require('../../models')

const Query = {
  async userInfo (root, { uid }) {
    const userInfo = await models.user.userInfo(uid)
    return userInfo
  }
}

const Mutation = {}

const Schema = {}

module.exports = {
  Schema,
  Query,
  Mutation
}
