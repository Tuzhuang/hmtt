<template>
  <div class="robot">
    <!-- 导航栏 -->
    <van-nav-bar class="topBar" title="小智同学" left-arrow @click-left="$router.back()" />
    <!-- 消息面板 -->
    <div class="warp_items" ref="chat">
      <div class="item" v-for="(item, index) in msgList" :class="{user:item.isME}" :key="index">
        <img
          :src="item.isME?meIcon:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=711323443,1073318054&fm=15&gp=0.jpg'"
          alt
        />
        <div>{{item.content}}</div>
      </div>
    </div>
    <!-- 消息发送 -->
    <van-search
      v-model="msg"
      class="sendSearch"
      background-color="#f4f5f6"
      @keyup.enter="onSend"
      left-icon
      show-action
      shape="round"
      placeholder="请输入..."
      @search="onSend"
    >
      <template #action>
        <div @click="onSend" class="sendDiv">发送</div>
      </template>
    </van-search>
  </div>
</template>

<script>
// 导入scoket.io-client
import io from "socket.io-client";

export default {
  name: "robot",
  data() {
    return {
      // 消息页面的数据
      msgList: [
        { isME: true, content: "你好吗" },
        { isME: false, content: "我不好" }
      ],
      // socket实例
      socket: null,
      // 输入框的值
      msg: "",
      // 自己的头像
      meIcon: this.$route.params.icon
    };
  },
  methods: {
    // 发送的点击事件
    onSend() {
      // 先判断当前的输入框是否有值
      if (this.msg.trim() == "") return;
      // 给服务器发消息
      this.socket.emit("message", {
        msg: this.msg,
        timestamp: Date.now()
      });
      // 把自己发的消息也push到数组中
      this.msgList.push({ isME: true, content: this.msg });
      // 静默刷新，要在渲染完毕之后再滚动滚动条
      this.$nextTick(() => {
        // 将滚动条滚动到最下面
        this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
      });
      // 消息发送完毕清空输入框
      this.msg = "";
    }
  },
  // 页面一加载的时候就执行的钩子函数
  created() {
    // 实例io
    this.socket = io(
      `http://ttapi.research.itcast.cn?token=${this.$store.state.token}`
    );
    // 获取到服务器传递过来的值
    this.socket.on("message", data => {
      // console.log(data);
      // 把服务器返回的值添加到数组中
      this.msgList.push({ isME: false, content: data.msg });
      // 机器人回复完消息的时候也要滚到最底部
      this.$nextTick(() => {
        this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight;
      });
    });
  }
};
</script>

<style lang="less">
.robot {
  .topBar {
    background-color: #3e9df8;
    i.van-icon.van-icon-arrow-left.van-nav-bar__arrow {
      color: white;
    }
    .van-nav-bar__title.van-ellipsis {
      color: white;
    }
  }
  .warp_items {
    // 布局技巧，定位可以撑开面板高度
    position: fixed;
    top: 46px;
    bottom: 64px;
    width: 100%;
    // 有滚动条
    overflow: auto;
    .item {
      display: flex;
      align-items: center;
      margin-top: 15px;

      padding: 0 10px;
      img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
      }
      div {
        max-width: 60%;
        padding: 8px 10px;
        background-color: #e0effb;
        border-radius: 10px;
        border: 1px solid #c2d9ea;
        margin-left: 15px;
      }
      &.user {
        flex-direction: row-reverse;
        div {
          margin-right: 15px;
        }
      }
    }
  }
  .sendSearch {
    display: flex;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #f4f5f6;
    .sendDiv {
      color: #3e9df8;
    }
    .van-search__content.van-search__content--round {
      background-color: white;
    }
  }
}
</style>