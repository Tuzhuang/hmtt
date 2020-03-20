<template>
  <div class="detail">
    <!-- 导航栏 -->
    <van-nav-bar
      class="topBar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
      @click-right="$toast({message:'想来点热情的音乐吗',icon:'fire-o'});"
    >
      <van-icon name="music-o" slot="right" />
    </van-nav-bar>
    <!-- 标题 -->
    <div class="title">{{articleData.title}}</div>
    <!-- 单元格信息 -->
    <van-cell>
      <template slot="title">
        <div class="info">
          <img class="icon" :src="articleData.aut_photo" alt />
          <div class="aut_info">
            <div>{{articleData.aut_name}}</div>
            <div>{{articleData.pubdate | filterTime}}</div>
          </div>
          <!-- 按钮 -->
          <van-button v-if="articleData.is_followed" @click="userFalse" round type="info">取消关注</van-button>
          <van-button v-else @click="userTrue" round type="info" icon="plus">关注</van-button>
        </div>
      </template>
    </van-cell>
    <!-- 文章描述信息 -->
    <div class="desc">
      <!-- 文章内容 -->
      <div class="descInfo" v-html="articleData.content"></div>
      <!-- 喜欢和不喜欢的按钮 -->
      <div class="button">
        <van-button
          v-if="articleData.attitude === 1"
          @click="doDisLike"
          round
          icon="like"
          plain
          hairline
          type="danger"
        >取消点赞</van-button>
        <van-button v-else @click="doLike" round icon="like" plain hairline type="info">点赞</van-button>

        <van-button
          v-if="articleData.attitude == 0"
          @click="doArtLike"
          round
          icon="delete"
          plain
          hairline
          type="danger"
        >取消不喜欢</van-button>
        <van-button v-else @click="doArtDisLike" round icon="delete" plain hairline type="info">不喜欢</van-button>
      </div>
    </div>
    <!-- 猜你喜欢 -->
    <div class="alsoLike">
      <h3>猜你喜欢</h3>
      <!-- 导入抽取后的评论组件 -->
      <comment></comment>
    </div>
    <!-- 底部评论 给子组件传值 -->
    <write :is_collected="articleData.is_collected" :isRaply="false"></write>
    <!-- 弹出层 -->
    <reply></reply>
  </div>
</template>

<script>
// 导入抽取后的子组件
import comment from "./components/comment";
import write from "./components/write";
import reply from "./components/reply";

// 导入获取文章详情的接口
import {
  getArticlesInfo,
  artLikings,
  artDislikes,
  articleDisLikes,
  articleLikes
} from "@/api/articles";
// 导入关注用户的接口
import { userFolloTrue, userFolloFalse } from "@/api/user";

export default {
  // 注册使用
  components: {
    comment,
    write,
    reply
  },
  data() {
    return {
      // 文章详情的数据源
      articleData: []
    };
  },
  methods: {
    // 获取文章详情的方法
    async getArticlesInfo() {
      // 先获取当前的文章id
      let article_id = this.$route.params.key;
      // 调用接口获取文章详情
      let res = await getArticlesInfo(article_id);
      // console.log(res);
      // 给文章详情的数据源赋值
      this.articleData = res.data;
      // 给是否关注了用户赋值
      this.is_followed = this.articleData.is_followed;
    },
    // 关注用户的点击事件
    async userTrue() {
      // 发送请求之前要先判断用户是否登录
      if (this.checkLogin()) {
        // 发送关注用户的请求  因为返回的响应体没什么作用所以可以不用接收
        await userFolloTrue(this.articleData.aut_id);
        // 弹出提示
        this.$toast.success("关注成功");
        // 然后把是否关注用户的bool值改成true
        this.articleData.is_followed = true;
      }
    },
    // 取消关注用户的点击事件
    async userFalse() {
      // 发送请求之前要先判断用户是否登录
      if (this.checkLogin()) {
        // 发送取关用户的请求
        await userFolloFalse(this.articleData.aut_id);
        // 弹出提示
        this.$toast.success("取关成功");
        // 然后把是否关注的bool值改成false
        this.articleData.is_followed = false;
      }
    },
    // 文章点赞的点击事件
    async doLike() {
      // 发送请求之前要先判断用户是否登录
      if (this.checkLogin()) {
        // 发送点赞文章的请求
        await artLikings(this.articleData.art_id);
        // 点赞成功之后就把对文章的态度改为1 喜欢
        this.articleData.attitude = 1;
      }
    },
    // 文章取消点赞的点击事件
    async doDisLike() {
      // 发送请求之前要先判断用户是否登录
      if (this.checkLogin()) {
        // 发送取消点赞的请求
        await artDislikes(this.articleData.art_id);
        // 把对文章的态度设置为 -1 无态度
        this.articleData.attitude = -1;
      }
    },
    // 文章不喜欢的点击事件
    async doArtDisLike() {
      // 发送请求之前要先判断用户是否登录
      if (this.checkLogin()) {
        // 发送文章不喜欢的请求
        await articleDisLikes(this.articleData.art_id);
        // 把对用户的态度设置为 0  不喜欢
        this.articleData.attitude = 0;
      }
    },
    // 文章取消不喜欢的点击事件
    async doArtLike() {
      // 发送请求之前要先判断用户是否登录
      if (this.checkLogin()) {
        // 发送取消不喜欢文章的请求
        await articleLikes(this.articleData.art_id);
        // 把对文章的态度设置为 -1  无态度
        this.articleData.attitude = -1;
      }
    }
  },
  // 页面一加载就调用的函数
  mounted() {
    // 页面一加载就调用方法获取文章详情
    this.getArticlesInfo();
  }
};
</script>

<style lang="less" scoped>
.detail {
  min-height: 100%;
  background-color: white;
  .topBar {
    background-color: #3194ff;
    .van-nav-bar__title.van-ellipsis {
      color: white;
    }
    i.van-icon.van-icon-arrow-left.van-nav-bar__arrow {
      color: white;
    }
    i.van-icon.van-icon-music-o {
      color: white;
    }
  }
  .title {
    text-align: center;
    font-size: 30px;
    margin-top: 20px;
  }
  .info {
    display: flex;
    margin-top: 20px;
    .icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
    .aut_info {
      // 表示使用剩余宽度的全部
      flex: 1;
      margin-left: 15px;
    }
  }
  .desc {
    margin-top: 20px;
    padding: 0 10px;
    .descInfo {
      line-height: 24px;
      // 因为父组件设置了scoped，所以要添加 /deep/
      /deep/img {
        // 代表里面的图片最大宽度只能是100%
        max-width: 100%;
      }
      /deep/ * {
        // 以下代码是为了让代码不会超出
        code {
          cursor: pointer;
          word-break: break-all;
          white-space: pre-wrap;
        }
      }
    }
    .button {
      display: flex;
      justify-content: space-around;
    }
  }
}

// 图片多 29062
</style>
