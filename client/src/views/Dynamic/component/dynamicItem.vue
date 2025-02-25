<template>
  <div class="dynamic-item"
       v-show="isShowDynamic">
    <div class="dynamic-header-row">
      <div class="account-group">
        <div class="user-popover-box">
          <router-link class="user-link"
                       :to="{
              name: 'user',
              params: { uid: dynamicItem.user.uid, routeType: 'article' }
            }"
                       v-if="dynamicItem.user.uid !== 'tree'">
            <img v-lazy="dynamicItem.user.avatar"
                 class="avatar"
                 alt="" />
          </router-link>

          <a href="javascript:;"
             target="_blank"
             class="user-link"
             v-else>
            <img v-lazy="dynamicItem.user.avatar"
                 class="avatar"
                 alt="" />
          </a>
        </div>
        <div class="dynamic-header-content">
          <div class="user-popover-box">
            <router-link :to="{
                name: 'user',
                params: { uid: dynamicItem.user.uid, routeType: 'article' }
              }"
                         class="username"
                         v-if="dynamicItem.user.uid !== 'tree'">{{ dynamicItem.user.nickname }}</router-link>
            <a href="javascript:;"
               target="_blank"
               class="username"
               v-else>
              {{ dynamicItem.user.nickname }}
            </a>
          </div>
          <div class="meta-box">
            <div class="position ellipsis">
              @ {{ dynamicItem.user.introduction }}
            </div>
            <div class="dot">·</div>
            <a href="javascript:;"
               target="_blank"
               rel=""
               class="time-box">
              <time :title="dynamicItem.create_dt"
                    class="time">{{
                dynamicItem.create_dt
              }}</time>
            </a>
          </div>
        </div>
      </div>
      <div class="header-action"
           v-if="dynamicItem.user.uid !== 'tree' && personalInfo.islogin">
        <button class="subscribe-btn follow-button"
                :class="[
            { active: isThumb(dynamicItem || '') },
            `user-attention-${dynamicItem.user.uid}`
          ]"
                @click="setUserAttention">
          {{ isThumb(dynamicItem) ? '已关注' : '关注' }}
        </button>
      </div>
    </div>

    <div class="dynamic-content-row">
      <div class="content-box">
        <div v-html="contentRender(dynamicItem.content)"></div>
        <div class="limit-ctl-box"></div>
      </div>
    </div>

    <div class="dynamic-image-row"
         v-if="dynamicItem.type === dynamicType.img">
      <img style="width: 100px; height: 100px"
           class="preview-picture"
           v-lazy="url"
           v-for="(url, key) in imgAnalyze(dynamicItem.attach)"
           :key="key"
           v-if="url"
           alt="" />
    </div>

    <div class="dynamic-link-row"
         v-if="dynamicItem.type === dynamicType.link">
      <a :href="dynamicItem.attach"
         target="_block">{{ dynamicItem.attach }}</a>
    </div>

    <div class="dynamic-topic-row"
         v-if="dynamicItem.topic">
      <router-link :to="{
          name: 'dynamicTopicView',
          params: { dynamicTopicId: dynamicItem.topic.topic_id }
        }"
                   class="topic-title">{{ dynamicItem.topic.name }}</router-link>
    </div>

    <div class="dynamic-action-row">
      <div class="action-box">
        <div class="like-action action"
             :class="{
            active: ~user.allLikeDynaicId.indexOf(dynamicItem.id || '')
          }"
             @click="setUserLikeDynamic">
          <i class="el-icon-star-off"></i>
          <span class="action-title">{{ dynamicItem.thumb_count }}</span>
        </div>
        <div class="comment-action action"
             @click="isCommnet = !isCommnet">
          <i class="el-icon-chat-line-round"></i>
          <span class="action-title">{{ dynamicItem.comment_count }}</span>
        </div>
        <div class="share-action action">
          <Dropdown>
            <div class="el-dropdown-link"
                 slot="button">
              <i class="el-icon-share"></i>
            </div>
            <div class="dropdown-menu-view">
              <div class="dropdown-menu-item"
                   @click="shareChange({ type: 'qq', data: dynamicItem })">
                分享到QQ
              </div>
              <div class="dropdown-menu-item"
                   @click="shareChange({ type: 'sina', data: dynamicItem })">
                分享到新浪
              </div>
              <div class="dropdown-menu-item"
                   @click="shareChange({ type: 'qzone', data: dynamicItem })">
                分享到QQ空间
              </div>
            </div>
          </Dropdown>
        </div>
        <div class="share-action action"
             v-if="isShowDeleteBtn()"
             @click="deleteDynamic">
          <span class="action-title">删除</span>
        </div>
      </div>
    </div>

    <div class="dynamic-comment-row"
         v-if="isCommnet && dfIsCommnet">
      <dynamic-comment @dynamicCommentChange="dynamicCommentChange"
                       :dynamicId="dynamicItem.id" />
    </div>
  </div>
</template>

<script>
import DynamicComment from '../../Comment/DynamicComment'
import { faceQQ, Dropdown } from '@components'
import { mapState } from 'vuex'
import { share } from '../../../utils'
import { dynamicType, modelType, dynamicTypeText } from '@utils/constant'

export default {
  name: 'dynamicItem',
  props: {
    dynamicItem: {
      default: () => {
        return {}
      }
    },
    dfIsCommnet: {
      // 判断默认是否展开评论
      default: true
    }
  },
  data () {
    return {
      isCommnet: false,
      isShowDynamic: true, // 是否显示动态
      dynamicType,
      modelType,
      dynamicTypeText
    }
  },
  methods: {
    setUserAttention () {
      // 设置用户关注用户
      if (!this.personalInfo.islogin) {
        this.$message.warning('请先登录')
        return false
      }
      this.$store
        .dispatch('common/SET_ATTENTION', {
          associate_id: this.dynamicItem.user.uid,
          type: modelType.user
        })
        .then(result => {
          if (result.state === 'success') {
            this.$message.success(result.message)
            this.$store.dispatch('user/GET_USER_INFO_ALL', {
              uid: this.personalInfo.user.uid
            })
            this.$store.dispatch('user/GET_ASSOCIATE_INFO')
            this.selectAttentionUserClass(result.data.type)
          } else {
            this.$message.error(result.message)
          }
        })
    },
    selectAttentionUserClass (type) {
      let userAttentionAll = document.querySelectorAll(
        `.user-attention-${this.dynamicItem.user.uid}`
      )
      for (let i = 0; i < userAttentionAll.length; i++) {
        if (type === 'enter') {
          userAttentionAll[i].classList.add('active')
          userAttentionAll[i].innerHTML = '已关注'
        } else {
          userAttentionAll[i].classList.remove('active')
          userAttentionAll[i].innerHTML = '关注'
        }
      }
    },
    isThumb (item) { // 是否收藏
      if (this.personalInfo.islogin) {
        if (this.user.associateInfo.dynamicThumdId && ~this.user.associateInfo.dynamicThumdId.indexOf(item.id)) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    isShowDeleteBtn () {
      // 是否显示删除按钮
      return (
        this.personalInfo.islogin &&
        this.personalInfo.user.uid === this.dynamicItem.user.uid &&
        this.$route.name !== 'dynamicView'
      )
    },
    deleteDynamic () {
      // 删除动态
      this.$confirm('此操作将永久删除此条片刻?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store
            .dispatch('dynamic/DELETE_DYNAMIC', {
              id: this.dynamicItem.id
            })
            .then(result => {
              if (result.state === 'success') {
                this.$message.success(result.message)
                this.isShowDynamic = false
              } else {
                this.$message.error(result.message)
              }
            })
        })
        .catch(() => { })
    },
    dynamicCommentChange () {
      // 动态一级子评论提交成功
      this.dynamicItem.comment_count =
        Number(this.dynamicItem.comment_count) + 1
    },
    contentRender (val) {
      let content = val
      faceQQ.map(faceItem => {
        content = content.replace(
          new RegExp('\\' + faceItem.face_text, 'g'),
          faceItem.face_view
        )
      })
      return content
    },
    setUserLikeDynamic () {
      if (!this.personalInfo.islogin) {
        this.$message.warning('请先登录')
        return false
      }
      /*用户like 动态*/
      this.$store
        .dispatch('common/SET_THUMB', {
          associate_id: this.dynamicItem.id,
          type: modelType.dynamic
        })
        .then(res => {
          if (res.state === 'success') {
            if (res.data.type === 'enter') {
              this.dynamicItem.thumb_count =
                Number(this.dynamicItem.thumb_count) + 1
            } else if (res.data.type === 'cancel') {
              this.dynamicItem.thumb_count -= 1
            }
            this.$store.dispatch('user/GET_USER_INFO_ALL', {
              uid: this.personalInfo.user.uid
            })
          } else {
            this.$message.warning(res.message)
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    imgAnalyze (attach) {
      let urlArr = attach.split(',') || []
      let length = attach.split(',').length
      return length > 0 ? urlArr : []
    },
    shareChange (val) {
      // 分享到其他
      let urlOrigin = window.location.origin // 源地址
      if (val.type === 'sina') {
        // 新浪
        share.shareToXl(
          val.data.content,
          urlOrigin + '/dynamic/' + val.data.id,
          this.website.meta.logo
        )
      } else if (val.type === 'qzone') {
        // qq空间
        share.shareToQq(
          val.data.content,
          urlOrigin + '/dynamic/' + val.data.id,
          this.website.meta.logo
        )
      } else if (val.type === 'qq') {
        // qq空间
        share.shareQQ(
          val.data.content,
          urlOrigin + '/dynamic/' + val.data.id,
          this.website.meta.logo
        )
      }
    }
  },
  computed: {
    ...mapState(['personalInfo', 'user', 'website'])
  },
  components: {
    DynamicComment,
    Dropdown
  }
}
</script>

<style scoped lang="scss">
.dynamic-item {
  .dynamic-content-row,
  .dynamic-image-row,
  .dynamic-link-row,
  .dynamic-topic-row {
    position: relative;
    margin: 5px 48px 5px 80px;
  }
  .account-group,
  .header-action {
    display: flex;
  }
  .dynamic-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 2rem 0 20px;
    .account-group {
      align-items: center;
    }
    .avatar {
      display: inline-block;
      position: relative;
      background-position: 50%;
      background-size: cover;
      background-repeat: no-repeat;
      background-color: #eee;
    }
    .avatar {
      flex: 0 0 auto;
      width: 45px;
      height: 45px;
      border-radius: 50%;
    }
    .dynamic-header-content {
      margin-left: 12px;
    }
    .username {
      font-size: 12px;
      font-weight: 600;
      color: #2e3135;
    }
    .meta-box {
      display: flex;
      align-items: center;
      margin: 3px 0 0;
      font-size: 13px;
      color: #8a9aa9;
      cursor: default;
    }
    .follow-button {
      margin: 0 0 0 auto;
      padding: 0;
      width: 55px;
      height: 23px;
      font-size: 13px;
      border-radius: 25px;
      border-color: #6cbd45;
      color: #6cbd45;
      border: 1px solid #37c700;
      background-color: #fff;
      &.active {
        border: 1px solid #999;
        color: #999;
      }
    }
  }
  .dynamic-content-row {
    margin-top: 5px;
    margin-bottom: 5px;
    .content-box {
      font-size: 14px;
      line-height: 20px;
      white-space: pre-line;
      color: #17181a;
      .emoji {
        width: 19px;
        height: 19px;
        vertical-align: sub;
      }
    }
  }
  .dynamic-link-row {
    a {
      display: flex;
      align-items: center;
      padding: 9px 15px;
      max-width: 100%;
      background-color: #fff;
      border: 1px solid #ebebeb;
      border-radius: 4px;
      box-sizing: border-box;
    }
  }
  .dynamic-image-row {
    .preview-picture {
      width: 100px;
      height: 100px;
      overflow: hidden;
      margin-right: 5px;
      margin-bottom: 5px;
    }
  }
  .dynamic-topic-row {
    .topic-title {
      font-size: 13px;
      display: inline-block;
      line-height: 22px;
      padding: 0 12px;
      border: 1px solid #007fff;
      border-radius: 14px;
      color: #007fff;
      user-select: none;
    }
  }
  .dynamic-action-row {
    padding: 0 12px 12px;
    .action-box {
      display: flex;
      position: relative;
      margin-top: 15px;
      height: 34px;
      background: #f8f8f8;
      border-radius: 10px;
      border: 1px solid #f8f8f8;
    }
    .action {
      flex: 1 1 33.333%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 100%;
      cursor: pointer;
      user-select: none;
      i {
        color: #8a93a0;
      }
      .action-title {
        margin-left: 5px;
        font-size: 13px;
        font-weight: 500;
        margin-top: 1px;
        color: #8a93a0;
      }
      &.active {
        .action-title,
        i {
          color: #007fff;
        }
      }
    }
  }
  .dynamic-comment-row {
    border-top: 1px solid #ebebeb;
    padding: 20px;
  }
}
</style>
