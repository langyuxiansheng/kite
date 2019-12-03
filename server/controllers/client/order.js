const models = require('../../../db/mysqldb/index')
const moment = require('moment')
const { resClientJson } = require('../../utils/resData')
const Op = require('sequelize').Op
const sequelize = require('sequelize')
const cheerio = require('cheerio')
const clientWhere = require('../../utils/clientWhere')
const xss = require('xss')
const config = require('../../config')
const { lowdb } = require('../../../db/lowdb/index')
const { TimeNow, TimeDistance } = require('../../utils/time')
const {
  statusList: { reviewSuccess, freeReview, pendingReview, reviewFail, deletes },
  articleType,
  userMessageAction,
  virtualType,
  virtualPlusLess,
  virtualAction,
  virtualInfo,
  virtualActionText,
  virtualTypeText,
  modelType
} = require('../../utils/constant')

const userVirtual = require('../../common/userVirtual')

function ErrorMessage (message) {
  this.message = message
  this.name = 'UserException'
}

class Order {
  // 签到

  /**
   * 获取消费列表
   * @param   {object} ctx 上下文对象
   */
  static async getVirtualList (req, res, next) {
    let page = req.query.page || 1
    let pageSize = Number(req.query.pageSize) || 10
    let { user = '' } = req
    try {
      let { count, rows } = await models.virtual.findAndCountAll({
        where: {
          uid: user.uid
        }, // 为空，获取全部，也可以自己添加条件
        offset: (page - 1) * pageSize, // 开始的数据索引，比如当page=2 时offset=10 ，而pagesize我们定义为10，则现在为索引为10，也就是从第11条开始返回数据条目
        limit: pageSize, // 每页限制返回的数据条数
        order: [['create_date', 'DESC']]
      })

      for (let i in rows) {
        rows[i].setDataValue(
          'create_dt',
          await moment(rows[i].create_date).format('YYYY-MM-DD')
        )
        rows[i].setDataValue(
          'ass_user',
          await models.user.findOne({
            where: { uid: rows[i].ass_uid },
            attributes: ['uid', 'avatar', 'nickname']
          })
        )
        rows[i].setDataValue('actionText', virtualActionText[rows[i].action])
        rows[i].setDataValue('typeText', virtualTypeText[rows[i].type])

        let associate = rows[i].associate && JSON.parse(rows[i].associate)
        // 以上是公共的数据

        if (rows[i].type === virtualType.other) {
          // 用户关注 所需要的数据已获取,无需处理
        } else if (rows[i].type === virtualType.user) {
        } else if (rows[i].type === virtualType.article) {
          rows[i].setDataValue(
            'article',
            await models.article.findOne({
              where: { aid: associate.aid },
              attributes: ['aid', 'title']
            })
          )
        } else if (rows[i].type === virtualType.article_blog) {
          rows[i].setDataValue(
            'article_blog',
            await models.article_blog.findOne({
              where: { blog_id: associate.blog_id },
              attributes: ['blog_id', 'name']
            })
          )
        } else if (rows[i].type === virtualType.book) {
          rows[i].setDataValue(
            'book',
            await models.book.findOne({
              where: { book_id: associate.book_id },
              attributes: ['book_id', 'title', 'books_id']
            })
          )
        } else if (rows[i].type === virtualType.books) {
          rows[i].setDataValue(
            'books',
            await models.books.findOne({
              where: { books_id: associate.books_id },
              attributes: ['books_id', 'title']
            })
          )
        } else if (rows[i].type === virtualType.dynamic) {
          rows[i].setDataValue(
            'dynamic',
            await models.dynamic.findOne({
              where: { id: associate.dynamic_id },
              attributes: ['id', 'content']
            })
          )
        } else if (rows[i].type === virtualType.system) {
        }
      }

      await resClientJson(res, {
        state: 'success',
        message: '数据返回成功',
        data: {
          count,
          list: rows,
          page,
          pageSize
        }
      })
    } catch (err) {
      resClientJson(res, {
        state: 'error',
        message: '错误信息：' + err.message
      })
      return false
    }
  }
}

module.exports = Order
