<template>
  <div class="write">
    <div class="write_comment">
      <!-- 输入框 -->
      <van-search
        class="write-search"
        v-model="txtVal"
        @keydown.enter="addComment"
        left-icon
        shape="round"
        background="#ffffff"
        placeholder="写评论"
      />
      <!-- 图标 -->
      <!-- 评论 -->
      <van-icon @click="addComment" class="write-icon" :info="totalComm" name="comment-o" />
      <!-- 收藏 -->
      <van-icon
        v-if="selfCollect"
        @click="callecFalse"
        class="write-icon"
        color="gold"
        name="star"
      />
      <van-icon v-else @click="callecTrue" class="write-icon" name="star-o" />
      <!-- 转发 -->
      <van-icon @click="$toast('该功能尚未开发，请尽情期待...')" class="write-icon" name="share" />
    </div>
  </div>
</template>

<script>
// 导入对文章评论的接口
import { addComments } from "@/api/comment";
// 导入兄弟之间传值的bus.js文件
import Bus from "@/utilis/bus.js";
// 导入收藏文章的接口
import { articleCollections, articleDisCollections } from "@/api/articles";

export default {
  // is_collected 用来控制是否点赞   isRaply 用来控制是否是评论的回复  reply_list 把父组件的数据源传递给子组件
  props: ["is_collected", "isRaply", "com_id", "reply_list"],
  data() {
    return {
      // 输入框的值
      txtVal: "",
      // 评论总条数
      totalComm: 0,
      // 因为单向数据流，子组件不可以修改父组件的值，所以创建一个中间变量
      selfCollect: this.is_collected
    };
  },
  methods: {
    // 输入框的回车事件
    async addComment() {
      // 发送请求之前先判断当前输入的内容不为空并且是登录状态，不能只输入空格
      if (this.txtVal.trim() !== "" && this.checkLogin()) {
        // 先判断一下当前是不是回复评论的组件
        if (this.isRaply) {
          // 发送请求对评论进行回复
          let res = await addComments({
            // 评论id
            target: this.com_id,
            // 评论内容
            content: this.txtVal,
            // 文章id
            art_id: this.$route.params.key
          });
          // console.log(res);
          // 把父组件传递过来的数据源再添加一个数据  因为是地址传递，所以共用一个地址，然而这边修改了，另一边也会跟着变
          this.reply_list.unshift(res.data.new_obj);
          // 传递过去之后把输入框的值清空
          this.txtVal = "";
          // 评论发送完成的时候要让totalComm值加加
          this.totalComm++;
          // 弹出提示
          this.$toast("评论成功");
          // 评论成功的时候要给父组件传值让评论量加加
          this.$emit("addCount");
        } else {
          // 发送请求对文章进行评论
          let res = await addComments({
            // 文章id
            target: this.$route.params.key,
            // 评论内容
            content: this.txtVal
          });
          //   console.log(res);
          // 通过bus.js进行兄弟之间的传值
          // 第一个参数是名称  第二个是参数值
          Bus.$emit("addComment", res.data.new_obj);
          // 传递过去之后把输入框的值清空
          this.txtVal = "";
          // 评论发送完成的时候要让totalComm值加加
          this.totalComm++;
          // 弹出提示
          this.$toast("评论成功");
        }
      } else {
        // 否则弹出提示
        this.$toast("请输入内容或者先登录试试");
      }
    },
    // 收藏文章的点击事件
    async callecTrue() {
      // 发请求之前先判断用户是否登录
      if (this.checkLogin()) {
        // 发送请求收藏文章
        await articleCollections(this.$route.params.key);
        // 给当前文章设置为收藏
        this.selfCollect = true;
        // 弹出提示
        this.$toast.success("收藏成功");
      }
    },
    // 取消文章收藏的点击事件
    async callecFalse() {
      // 发请求之前先判断用户是否登录
      if (this.checkLogin()) {
        // 发送请求取消收藏文章
        await articleDisCollections(this.$route.params.key);
        // 给当前文章设置为取消收藏
        this.selfCollect = false;
        // 弹出提示
        this.$toast.success("取消收藏成功");
      }
    }
  },
  // 页面上最早可以访问data属性的钩子函数
  created() {
    // 获取评论组件传过来的评论总数
    Bus.$on("totalComm", data => {
      // console.log(data);
      // 给评论总条数赋值
      this.totalComm = data;
    });

    // 获取评论回复的回复数量
    Bus.$on("replyComm", data => {
      // console.log(data);
      // 给评论总条数赋值
      this.totalComm = data;
    });
  },
  // 侦听父组件传递过来的值，如果发生变化就重新赋值给selfCollect
  watch: {
    is_collected(val) {
      // 重新给子组件的值赋值
      this.selfCollect = val;
    }
  }
};
</script>

<style lang="less">
.write {
  background-color: white;
  .write_comment {
    background-color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: center;
    .write-search {
      flex: 1;
      // border-top: .5px solid #cccccc;
    }
    .write-icon {
      font-size: 22px;
      margin-right: 20px;
    }
    i.write-icon.van-icon.van-icon-comment-o {
      margin-top: 2px;
    }
  }
}
</style>