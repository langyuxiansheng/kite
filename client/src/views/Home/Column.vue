<template>
  <div class="home-lay index-box-container"
       id="index">
    <div class="index-container">
      <div class="row">
        <div class="home-col-left col-xs-12 col-sm-8 col-md-8">
          <!--home-lay layout-content start-->
          <section class="layout-content">
            <NavHeader :navItem="articleColumn.homeColumn" />

            <NavSort @navTap="navTap"
                     ref="navSort"></NavSort>

            <div class="article-view"
                 id="article-view">
              <scroll-loading @scroll-loading="infiniteHandler"
                              :isLoading="isLoading"
                              :isMore="isMore">
                <div class="article-item"
                     v-for="(item,key) in home.article.article_list"
                     :key="key">
                  <ArticleItem :articleItem="item" />
                </div>
              </scroll-loading>
            </div>
          </section>
          <!--home-lay layout-content end-->
        </div>
        <div class="home-col-right col-xs-12 col-sm-4 col-md-4">
          <!--aside.html start-->
          <HomeAside />
          <!--aside.html end-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HomeAside from "@views/Home/HomeAside";
import NavHeader from "@views/Home/NavHeader";
import NavSort from "@views/Home/NavSort";
import ArticleItem from "@views/Article/component/ArticleItem";
import { mapState } from "vuex";
import { ScrollLoading } from "@components";
import { baidu, google } from '@utils'
import googleMixin from '@mixins/google'

export default {
  name: "column",
  mixins: [googleMixin], //混合谷歌分析
  metaInfo () {
    return {
      title: this.currentColumn().name,
      titleTemplate: `%s - ${this.website.meta.website_name}`,
      meta: [
        {
          // set meta 
          name: "description",
          content: `${this.currentColumn().name} - ${this.currentColumn().description}`
        }
      ],
      htmlAttrs: {
        lang: "zh"
      },
      script: [
        ...baidu.resource({
          route: this.$route,
          config: this.website.config,
          random: this.$route.params.en_name
        }),
        ...google.statisticsCode({
          route: this.$route, googleCode: this.website.config.googleCode, random: ''
        })
      ],
      __dangerouslyDisableSanitizers: ['script']
    };
  },
  async asyncData ({ store, route, accessToken = "" }) {
    // 触发 action 后，会返回 Promise
    return Promise.all([
      store.commit(
        "articleColumn/SET_CURRENT_ARTICLE_COLUMN",
        route.params.en_name || ""
      ),
      store.commit("home/SET_INIT_INDEX_ARTICLE_LIST"), // 重置文章列表数据
      store.dispatch("articleColumn/GET_ARTICLE_COLUMN"),
      store.dispatch("home/GET_INDEX_ARTICLE_LIST", {
        columnEnName: route.params.en_name || ""
      })
    ]);
  },
  data () {
    return {
      page: 2,
      sort: "",
      isLoading: false,
      isMore: true
    };
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // this.initHomeDate()
    this.$refs.navSort.dafauleNav();
    this.isMore = true;
    next();
  },
  created () {
    this.$store.dispatch("home/GET_POPULAR_ARTICLE_TAG"); // 获取热门文章标签
  },
  methods: {
    navTap (val) {
      this.sort = val;
      this.initHomeDate();
    },
    initHomeDate () {
      this.$store.commit("home/SET_INIT_INDEX_ARTICLE_LIST"); // 重置文章列表数据
      this.isMore = true;
      this.page = 1;
      this.infiniteHandler();
    },
    currentColumn () {
      let _currentColumn = {}
      this.articleColumn.homeColumn.map(item => {
        if (item.en_name === this.$route.params.en_name) {
          _currentColumn = item
        }
      })
      return _currentColumn
    },
    infiniteHandler () {
      this.isLoading = true;
      this.$store
        .dispatch("home/GET_INDEX_ARTICLE_LIST", {
          columnEnName: this.$route.params.en_name,
          sort: this.sort,
          page: this.page
        })
        .then(result => {
          this.isLoading = false;
          if (result.data.article_list.length === 10) {
            this.page += 1;
          } else {
            this.isMore = false;
          }
        })
        .catch(err => {
          this.isMore = false;
        });
    }
  },
  computed: {
    ...mapState(["home", "articleColumn", "website"]) // home:主页  articleColumn:文章的专栏
  },
  components: {
    HomeAside,
    NavHeader,
    NavSort,
    ArticleItem,
    ScrollLoading
  }
};
</script>

<style scoped lang="scss">
.home-lay {
  .home-col-left {
    padding-right: 30px;
  }
  .home-col-right {
    padding-left: 30px;
  }
  .main-top {
    width: 100%;
    padding: 15px 20px;
    margin-bottom: 15px;
    box-shadow: 0 1px 3px rgba(27, 95, 160, 0.1);
    .main-top-view {
      padding-left: 70px;
      > h3 {
        font-weight: bold;
      }
      .info {
        color: #999;
        font-size: 14px;
      }
    }
  }
  .layout-content {
    position: relative;
    border-radius: 2px;
    .article-view {
      /deep/ .article-item {
        border-bottom: 1px solid rgba(178, 186, 194, 0.15);
      }
    }
  }
}

@media (max-width: 575px) {
  .home-lay {
    .home-col-left {
      padding-right: 15px;
    }
    .home-col-right {
      padding-left: 15px;
    }
  }
}
</style>

