<template>
  <div class="comment-form"
       id="comment_form">
    <div class="comment-avatar">
      <img v-if="personalInfo.islogin"
           v-lazy="personalInfo.user.avatar"
           class="box-image"
           alt="">
      <img v-else
           src="/default/img/avatar.jpeg"
           class="box-image"
           alt="">
    </div>

    <div class="form-item"
         style="margin-left: 50px;">
      <div class="input-view">
        <textarea name="comment"
                  v-model="commentContent"
                  class="txt long-txt textarea "></textarea>
      </div>

      <div class="form-item form-btns clearfix">
        <div class="left-view">
          <Popover :visible.sync="faceVisible">
            <comment-face @changeFace="changeFace"
                          v-if="faceVisible" />
            <i slot="button"
               class="face-icon el-icon-picture-outline-round"></i>
          </Popover>
        </div>
        <div class="right-view">
          <div class="star-view"
               v-if="isStar">
            <label for=""
                   class="star-label">评价星级：</label>
            <select class="star-select"
                    v-model="star"
                    placeholder="请选择星级">
              <option value="5">5星</option>
              <option value="4">4星</option>
              <option value="3">3星</option>
              <option value="2">2星</option>
              <option value="1">1星</option>
            </select>
          </div>
          <button type="submit"
                  class="form-btn"
                  @click="submitComment">提交评价</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Popover, Face } from "@components";
export default {
  name: 'CommentForm',
  data () {
    return {
      commentContent: '', // 顶级输入框
      star: "",
      faceVisible: false
    }
  },
  props: {
    isStar: {
      default: false
    },
    type: {
      type: String,
      default: 'parent'
    },
    reply_uid: {
      default: ''
    },
    reply_id: {
      default: ''
    },
    parent_id: {
      default: ''
    },
  },
  methods: {
    getParams () {
      return {
        books_id: this.$route.params.books_id,
        star: this.star,
        content: this.commentContent,
        reply_uid: this.reply_uid,
        reply_id: this.reply_id,
        parent_id: this.parent_id,
      }
    },
    changeFace (val) {
      this.faceVisible = false
      this.commentContent = this.commentContent + val.face_text
    },
    submitComment () { // 提交评论
      if (!this.commentContent) {
        this.$message.warning('请填写评论内容')
        return false
      }
      if (!this.star && !this.parent_id) {
        this.$message.warning('请选择星级')
        return false
      }
      var params = this.getParams()
      this.$store.dispatch("books/BOOKS_COMMENT_CREATE", params)
        .then(result => {
          this.commentContent = ''
          this.$emit('commentChange', result)
        })
        .catch(err => {
          this.commentContent = ''
        })
    }
  },
  computed: {
    article () {
      return this.$store.state.article.article || {}
    },
    personalInfo () { // 登录后的个人信息
      return this.$store.state.personalInfo || {}
    }
  },
  components: {
    Face,
    Popover
  }
}
</script>

<style scoped lang="scss">
.comment-form {
  .comment-avatar {
    float: left;
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 35px;
    .box-image {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
  }
  .form-item {
    margin-bottom: 20px;
    font-size: 14px;
    line-height: 40px;
    color: #555;
    display: block;
    .txt {
      display: block;
      box-sizing: border-box;
      width: 100%;
      border-radius: 40px;
      line-height: 25px;
      height: 45px;
      padding: 5px 15px;
      border: none;
      background: #f7f7f7;
      color: #555;
      font-size: 14px;
      outline: none;
      float: left;
      font-family: "Microsoft Yahei", sans-serif;
      &.textarea {
        height: 80px;
        border-radius: 20px;
      }
    }
    .input-view {
      position: relative;
    }
    .left-view {
      float: left;
      .iconfont {
        margin-left: 15px;
        display: inline-block;
        font-size: 20px;
        cursor: pointer;
      }
    }
    .right-view {
      float: right;
      padding-top: 15px;
      .star-view {
        display: inline-block;
        .star-label {
        }
        .star-select {
          width: 120px;
          height: 30px;
        }
      }
    }
    .form-btn {
      display: inline-block;
      border-radius: 40px;
      box-sizing: border-box;
      border: none;
      background: #f50;
      color: #fff;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      padding: 0 30px;
      font-size: 14px;
      margin-left: 10px;
      outline: none;
      &.btn-cancel {
        background: #999999;
      }
    }
    .face-icon {
      font-size: 18px;
    }
  }
}
</style>
