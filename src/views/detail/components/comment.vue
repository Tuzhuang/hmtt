<template>
  <div class="mycomment">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <!-- 评论 -->
      <van-cell class="title" v-for="(item, index) in commentList" :key="index">
        <template slot="title">
          <div class="info">
            <img class="icon" :src="item.aut_photo" alt />
            <div class="aut_info">
              <div class="aut_name">{{item.aut_name}}</div>
              <div class="commcon">{{item.content}}</div>
              <div class="bottom">
                <span class="time">{{item.pubdate | filterTime}}</span>
                <van-tag
                  @click="openPopup(item)"
                  class="tag"
                  color="#eff7f8"
                  round
                >回复 {{item.reply_count}}</van-tag>
              </div>
            </div>
            <div class="like">
              <van-icon
                v-if="item.is_liking"
                @click="likFalse(item)"
                class="iconLike"
                color="#ff4444"
                name="like"
              />
              <van-icon
                v-else
                @click="likTrue(item)"
                class="iconLike"
                color="#ff4444"
                name="like-o"
              />
              <span class="zan">{{item.like_count}}</span>
            </div>
          </div>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
// 导入获取评论的接口
import { getComments } from "@/api/comment";
// 导入用于兄弟组件之间传值的bus.js文件
import Bus from "@/utilis/bus.js";
// 导入对评论点赞的接口
import { commentLikings, commentDisLikings } from "@/api/comment";

export default {
  data() {
    return {
      // 控制是否还可以加载更多数据，为false代表可以加载
      loading: false,
      // 代表数据是否已经加载到底了，为false代表数据已经加载完了
      finished: false,
      // 表示评论数据的偏移值，默认为undefined
      offset: undefined,
      // 评论的数据源
      commentList: []
    };
  },
  methods: {
    // 上拉加载更多的方法
    async onLoad() {
      // 发送获取评论数据的接口
      let res = await getComments({
        // 评论类型  a 代表对文章的评论
        type: "a",
        // 文章的id  从路径上获取
        source: this.$route.params.key,
        // 应该传入上一页的lastID，第一次先不传，先传undefined
        offset: this.offset,
        // 页容量  默认为10页
        limit: 10
      });
      // console.log(res);
      // 给评论列表的数据源赋值 要用push的方法
      this.commentList.push(...res.data.results);
      // 要再把loading设置为false，表示可以继续加载数据
      this.loading = false;
      // 还要把当前页的last_id设置为offset作为下一次请求评论的开头标志
      this.offset = res.data.last_id;
      // 最后要做一个判断，判断当前数据是否已经加载完毕了
      if (res.data.last_id === res.data.end_id) {
        // 代表数据已经全部加载完毕了
        this.finished = true;
      }
      // 调用bus方法把总评论数传递给write组件
      Bus.$emit("totalComm", res.data.total_count);
    },
    // 给评论点赞的点击事件
    async likTrue(item) {
      // 判断用户是否登录
      if (this.checkLogin()) {
        // 发送请求对评论点赞
        await commentLikings(item.com_id);
        // 给评论是否点赞的bool值改成true
        item.is_liking = true;
        // 还要让当前的点赞数加一
        item.like_count++;
      }
    },
    // 给评论取消点赞的点击事件
    async likFalse(item) {
      // 先判断用户是否登录
      if (this.checkLogin()) {
        // 发送取消对评论点赞的接口
        await commentDisLikings(item.com_id);
        // 给评论是否点赞的bool值设置为false
        item.is_liking = false;
        // 还要让当前的点赞数减一
        item.like_count--;
      }
    },
    // 打开评论的回复的点击事件
    openPopup(item) {
      // 把item的值传递给replay组件
      Bus.$emit("replyPop", item);
    }
  },
  //   页面一加载的时候就执行  这里是最早可以访问data属性里面的值得地方
  created() {
    // 接收兄弟组件传递过来的值
    // 第一个值是一个名称，第二个值是一个回调函数
    Bus.$on("addComment", data => {
      //   console.log(data);
      // 把兄弟组件传递过来的值从头部添加到评论列表的数组中
      this.commentList.unshift(data);
    });
  }
};
</script>

<style lang="less">
.mycomment {
  margin-bottom: 100px;
  .title {
    .info {
      display: flex;
      justify-content: space-between;
      .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 15px;
      }
      .aut_info {
        flex: 1;
        .aut_name {
          font-size: 18px;
          color: teal;
        }
        .bottom {
          .time {
            font-size: 16px;
            margin-right: 10px;
          }
          .tag {
            padding: 3px 7px;
            font-size: 16px;
            color: black;
          }
        }
      }
      .like {
        display: flex;
        align-items: center;
        .iconLike {
          font-size: 22px;
          margin-right: 10px;
        }
        .zan {
          font-size: 20px;
        }
      }
    }
  }
}
</style>