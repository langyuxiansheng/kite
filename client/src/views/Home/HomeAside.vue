<template>
  <div class="home-lay layout-aside">

    <div class="notice client-card"
         v-if="website.notice.length>0">
      <a class="notice-item"
         v-for="(item,key) in website.notice"
         v-if="item.enable"
         :href="item.link"
         :key="key">{{item.title}}</a>
    </div>

    <div class="aside-component client-card">
      <h3 class="title">写下你想说的</h3>
      <div class="issue-btn">
        <a href="javascript:;"
           @click="createDynamic"
           class="btn-dynamic">
          <i class="el-icon-chat-line-round"></i>发片刻
        </a>
        <a href="javascript:;"
           @click="createArticle"
           class="btn-note">
          <i class="el-icon-edit"></i>写文章
        </a>
        <a href="javascript:;"
           @click="createBooks"
           class="btn-book">
          <i class="el-icon-notebook-2"></i>撰小书
        </a>
      </div>
    </div>

    <div class="advertise client-card"
         v-if="website.advertise.length>0">
      <div class="advertise-item"
           v-for="(advertiseItem,key) in website.advertise"
           v-if="advertiseItem.enable"
           :key="key">
        <a class="advertise-img"
           :href="advertiseItem.link||'javascript:;'"
           v-if="advertiseItem.img_url">
          <img v-lazy="advertiseItem.img_url"
               alt="">
        </a>
        <a class="advertise-text"
           :href="advertiseItem.link||'javascript:;'"
           v-else>
          {{advertiseItem.title}}
        </a>
      </div>
    </div>

    <div class="hot-tags-for-sidebar client-card">
      <header class="heading u-clearfix heading--borderedBottom heading--allCaps heading--normal heading--simple xzl-margin-bottom15">
        <div class="u-clearfix">
          <div class="heading-content hot-tags-header u-floatLeft">
            <span class="hot-tags-header-title">
              热门标签
            </span>
            <span class="hot-tags-more">
              <router-link :to="{name:'subscribe_tag',params:{type:'all'}}">查看更多 &gt;</router-link>
            </span>
          </div>
        </div>
      </header>
      <ul class="tags xzl-tags-list hot-sidebar-items hot-tags-sidebar tags--light">
        <li v-for="(item,key) in home.popular_article_tag"
            :key="key">
          <router-link class="link xzl-link-color"
                       :to="{name:'article_tag',params:{en_name:item.en_name}}">
            {{item.name}}
          </router-link>
        </li>
      </ul>
    </div>

    <div class="website-information">

      <ul class="more-list">
        <li class="item"
            v-if="website.meta.about"><a :href="website.meta.about"
             target="_blank">关于</a></li>
        <li class="item"
            v-if="website.meta.feedback"><a :href="website.meta.feedback"
             target="_blank">建议反馈</a></li>
      </ul>
      <ul class="more-list"
          v-if="website.meta.miibeian">
        <li class="item"><a href="http://www.miibeian.gov.cn"
             target="_blank">{{website.meta.miibeian}}</a></li>
      </ul>
      <ul class="more-list">
        <li class="item"><a>©{{currYear}} {{website.meta.website_name}}</a></li>
      </ul>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'HomeAside',
  methods: {
    createDynamic () {
      if (!this.$store.state.personalInfo.islogin) {
        this.$router.push({ name: 'signIn' })
      } else {
        this.$router.push({ name: 'dynamics', params: { dynamicTopicId: 'newest' } })
      }
    },
    createBooks () {
      if (!this.$store.state.personalInfo.islogin) {
        this.$router.push({ name: 'signIn' })
      } else {
        this.$router.push({ name: 'booksWrite', params: { type: 'create' } })
      }
    },
    createArticle () {
      if (!this.$store.state.personalInfo.islogin) {
        this.$router.push({ name: 'signIn' })
      } else {
        this.$router.push({ name: 'Write', params: { type: 'create' } })
      }
    }
  },
  computed: {
    ...mapState(['home', 'website']),
    currYear () {
      let date = new Date
      let year = date.getFullYear()
      return year
    }
  }
}
</script>

<style scoped lang="scss">
.layout-aside {
  .notice {
    padding: 15px 12px;
    // margin-bottom: 20px;
    // border: 1px solid transparent;
    // border-radius: 12px;
    background-color: #fcf8e3;
    border-color: #faebcc;
    color: #8a6d3b;
    .notice-item {
      display: block;
      line-height: 20px;
      color: #8a6d3b;
      font-size: 14px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .advertise {
    .advertise-item {
      overflow: hidden;
      margin-bottom: 10px;
      .advertise-img {
        border-radius: 12px;
        overflow: hidden;
        display: block;
      }
      .advertise-text {
        font-size: 14px;
        color: #666;
      }
    }
  }
  .aside-component {
    margin-bottom: 24px;
    background: #f8f8f8;
    padding: 24px;
    border-radius: 4px;
    transition: all 0.3s ease;
    .title {
      font-size: 16px;
      line-height: 28px;
      color: rgba(0, 0, 0, 0.88);
      font-weight: 700;
      margin-bottom: 16px;
      position: relative;
      padding-left: 12px;
      &::before {
        content: "";
        width: 4px;
        height: 20px;
        position: absolute;
        top: 4px;
        left: 0;
        border-radius: 2px;
        background: #ffd600;
      }
    }
    .issue-btn {
      a {
        font-size: 15px;
        width: 100%;
        text-align: center;
        display: block;
        cursor: pointer;
        padding: 6px 0;
        color: #ffffff;
        margin-bottom: 10px;
        border-radius: 5px;
        i {
          margin-right: 10px;
        }
      }
      .btn-dynamic {
        // color: #db5000;
        // border: 1px solid rgba(219, 80, 0, 0.7);
        color: rgba(0, 0, 0, 0.88);
        background: #ffb84f;
        border: 1px solid #ffb84f;
      }
      .btn-note {
        color: rgba(0, 0, 0, 0.88);
        background: #c1e4de;
        border: 1px solid #c1e4de;
      }
      .btn-book {
        color: rgba(0, 0, 0, 0.88);
        background: #b7d6ec;
        border: 1px solid #b7d6ec;
      }
    }
  }

  .hot-tags-for-sidebar {
    margin-bottom: 24px;
    background: #f8f8f8;
    padding: 24px;
    border-radius: 5px;
    transition: all 0.3s ease;
    .hot-tags-header {
      position: relative;
      padding-bottom: 13px;
      // border-bottom: 1px solid #ededed;
      width: 100%;
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      line-height: 1;
      margin-bottom: 15px;
      padding-left: 12px;
      &::before {
        content: "";
        width: 4px;
        height: 20px;
        position: absolute;
        left: 0;
        border-radius: 2px;
        background: #ffd600;
      }
      span.hot-tags-header-title {
        font-weight: bold;
        font-size: 16px;
        color: #2d2d2f;
        &:after {
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 1px;
          width: 64px;
          background: #2d2d2f;
          // content: "";
        }
      }
      .hot-tags-more {
        margin-left: auto;
        font-size: 14px;
        color: #c7c7c7;
      }
    }
    ul.hot-sidebar-items li {
      display: inline-block;
      a {
        border: 1px solid #f5f5f5;
        border-radius: 17px;
        height: 32px;
        margin-right: 8px;
        color: #888;
        margin-bottom: 8px;
        padding: 5px 10px;
        background: rgba(0, 0, 0, 0.03);
        line-height: 22px;
        display: block;
        font-size: 14px;
      }
    }
  }

  .website-information {
    border-top: 1px solid #ededed;
    padding-top: 10px;
    ul {
      display: block;
      li {
        display: inline-block;
        font-size: 14px;
        margin-right: 30px;
        margin-top: 10px;
        a {
          color: rgba(0, 0, 0, 0.44) !important;
          fill: rgba(0, 0, 0, 0.44) !important;
          line-height: 20px;
        }
      }
    }
  }
}

@media (max-width: 575px) {
  body {
    .layout-aside {
      display: none;
    }
  }
}
</style>
