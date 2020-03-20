<template>
  <div class="result">
    <!-- 导航栏 -->
    <van-nav-bar class="topBar" title="标题" left-arrow @click-left="$router.back()" />
    <!-- 列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- 单元格 -->
      <van-cell v-for="(item, index) in list" :key="index">
        <template slot="title">
          <!-- 标题 -->
          <div class="title">
            {{item.title}}
            <!-- 一张图片的时候 -->
            <img v-if="item.cover.type === 1" :src="item.cover.images[0]" />
          </div>
          <!-- 宫格图片 -->
          <van-grid v-if="item.cover.type === 3" :border="false" :column-num="3">
            <van-grid-item v-for="(item1, index1) in item.cover.images" :key="index1">
              <van-image :src="item1" />
            </van-grid-item>
          </van-grid>
          <!-- 占位盒子 -->
          <div v-if="item.cover.type === 0" class="placehold"></div>
          <!-- 用户评论 时间 -->
          <div class="comment">
            <span>{{item.aut_name}}</span>
            <span>{{item.comm_count}} 评论</span>
            <span>{{item.pubdate | filterTime}}</span>
          </div>
          <!-- 更多操作 -->
          <div class="more">
            <!-- 评论 传入文章id -->
            <div @click="btnComment(item.art_id)">
              <van-icon class="moreIcon" name="comment" />
              <span>评论</span>
            </div>
            <!-- 点赞 -->
            <div>
              <van-icon class="moreIcon" name="like" />
              <span>点赞</span>
            </div>
            <!-- 分享 -->
            <div>
              <van-icon class="moreIcon" name="share" />
              <span>分享</span>
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
// 导入获取搜索结果的接口
import { getSearch } from "@/api/search.js";
// 导入全局封装好的插件
// import myPlugin from "@/utilis/myPlugin";
// 导入vuex
import store from "@/store/";

export default {
  name: "result",
  data() {
    return {
      // 控制加载状态，为false代表可以加载更多
      loading: false,
      // 控制数据是否加载完毕，为false代表还有数据没有加载完
      finished: false,
      // 列表的数据源
      list: [],
      // 当前页
      page: 1,
      // 页容量
      pagesize: 10
    };
  },
  methods: {
    // 加载更多数据的方法，这个方法一旦调用就会把loading改为true
    async onLoad() {
      // 调用接口获取数据
      let res = await getSearch({
        page: this.page,
        per_page: this.pagesize,
        q: this.$route.params.key
      });
      console.log(res);
      // 请求完数据让当前页加一
      this.page += 1;
      // 判断当前是否还有数据，如果还有数据的话就继续请求
      // 先得到总共有多少页
      let totalPage = Math.ceil(res.data.total_count / this.pagesize);
      if (totalPage > this.page) {
        // 代表还有数据，就把loading设置为false，代表可以继续请求新的数据
        this.loading = false;
        // 给列表的数据源赋值
        this.list.push(...res.data.results);
      } else {
        // 将是否还有更多数据设置为true，代表没有更多数据了
        this.finished = true;
      }
    },
    // 评论的点击事件
    btnComment(art_id) {
      // 判断当前用户有没有登录，如果没有登录的话就打回登录页
      if (this.checkLogin()) {
        // 登录成功的话就跳转到文章详情页面并携带文章id
        this.$router.push(`/detail/${art_id}`);
      }
    }
  }
};
</script>

<style lang="less">
.result {
  .topBar {
    background-color: #3e9df8;
    i.van-icon.van-icon-arrow-left.van-nav-bar__arrow {
      color: white;
    }
    .van-nav-bar__title.van-ellipsis {
      color: white;
    }
  }
  .van-cell {
    padding: 0;
    margin-bottom: 20px;
    border-radius: 25px;
    .title {
      padding: 0 10px;
      padding-top: 10px;
      display: flex;
      justify-content: space-between;
      img {
        width: 180px;
      }
    }
    .placehold {
      height: 40px;
    }
  }
  .comment {
    padding: 0 10px;
    span {
      color: #999999;
      margin-right: 20px;
    }
  }
  .more {
    height: 45px;
    margin-top: 5px;
    display: flex;
    justify-content: space-around;
    border-top: 0.5px solid #ececec;
    div {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-right: 0.5px solid #ececec;
      .moreIcon {
        font-size: 18px;
        margin-right: 10px;
      }
      span {
        font-size: 14px;
      }
    }
  }
}
</style>