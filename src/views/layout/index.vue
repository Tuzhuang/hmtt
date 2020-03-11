<template>
  <div>
    <!-- 路由出口 -->
    <router-view></router-view>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="active">
      <van-tabbar-item to="/home" icon="home-o">主页</van-tabbar-item>
      <van-tabbar-item to="/faqs" icon="comment-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="tv-o">视频</van-tabbar-item>
      <van-tabbar-item to="/mine" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 底部导航栏的默认选中
      active: 0
    };
  }
};
</script>

<style>
</style>