<template>
  <div class="mine">
    <!-- 用户信息栏 -->
    <div v-if="$store.state.token" class="userInfo">
      <!-- 头像 用户名 -->
      <div class="userIcon">
        <img @click="$router.push('/profile')" :src="userData.photo" alt />
        <span>{{userData.name}}</span>
      </div>
      <!-- 今日阅读 -->
      <div class="readTime">
        <div>今日阅读</div>
        <div>1分32秒</div>
      </div>
      <!-- 统计数据 -->
      <div class="dataInfo">
        <div class="infoItem">
          <span>{{userData.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="infoItem">
          <span>{{userData.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="infoItem">
          <span>{{userData.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>
    <!-- 没有登录的时候的用户信息栏 -->
    <div v-else class="notLogin">
      <img
        @click="$router.push('/login')"
        class="notLoginImg"
        src="http://toutiao.research.itcast.cn/img/wd_weidl.png"
        alt
      />
      <span @click="$router.push('/login')" class="notLoginSpan">请登录</span>
    </div>
    <div class="grid_item">
      <!-- 操作菜单 -->
      <van-grid :column-num="3">
        <van-grid-item icon="star-o" color="#ff4444" text="收藏" />
        <van-grid-item icon="underway-o" text="历史" />
        <van-grid-item icon="records" text="作品" />
      </van-grid>
    </div>
    <!-- 下面的功能区域 -->
    <van-cell-group class="wrap_item">
      <van-cell title="消息通知" is-link />
      <van-cell title="用户反馈" is-link />
      <!-- 匿名传参 传参不被显示出来 -->
      <van-cell
        @click="$router.push({name:'robot',params:{icon:userData.photo}})"
        title="小智同学"
        is-link
      />
    </van-cell-group>
    <!-- 退出登录 -->
    <van-cell-group style="margin-top:10px">
      <van-cell @click="logout" title="退出"></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 导入获取用户自己信息的接口
import { getUserInfo } from "@/api/user";
// 导入操作token的文件
import { removeToken } from "@/utilis/token.js";

export default {
  data() {
    return {
      // 用户信息的数据源
      userData: []
    };
  },
  methods: {
    // 获取用户自己的信息的接口
    async getUserInfo() {
      let res = await getUserInfo();
      // console.log(res);
      // 给用户信息赋值
      this.userData = res.data;
    },
    // 退出登录的点击事件
    logout() {
      // 提示用户是否退出
      this.$dialog
        .confirm({
          message: "是否退出登录"
        })
        .then(() => {
          // 删除本地存储和vuex的存储
          removeToken("tokenInfo");
          this.$store.commit("changeToken", "");
          // 消息提示
          this.$toast.success("退出成功");
        })
        .catch(() => {});
    }
  },
  // 页面一加载就调用的接口
  created() {
    // 调用接口获取用户自己信息的方法
    this.getUserInfo();
  }
};
</script>

<style lang="less">
.mine {
  .userInfo {
    background-color: #3e9df8;
    padding: 20px 20px;
    box-sizing: border-box;
    .userIcon {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      span {
        font-size: 18px;
        color: white;
        margin-left: 20px;
      }
    }
    .readTime {
      position: absolute;
      top: 8%;
      right: 0;
      padding: 6px 15px;
      background-color: #2b6ead;
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
      div {
        font-size: 12px;
        color: white;
      }
    }
    .dataInfo {
      display: flex;
      justify-content: space-between;
      margin-top: 60px;
      .infoItem {
        width: 70px;
        display: flex;
        // 修改主轴方向
        flex-direction: column;
        align-items: center;
        span {
          font-size: 16px;
          color: white;
        }
      }
    }
  }
  .grid_item {
    padding: 10px 0;
    background-color: white;
  }
  i.van-icon.van-icon-star-o.van-grid-item__icon {
    color: #ff4444;
  }
  i.van-icon.van-icon-underway-o.van-grid-item__icon {
    color: #ff9e1f;
  }
  i.van-icon.van-icon-records.van-grid-item__icon {
    color: #6a93ff;
  }
  .van-grid-item__content::after {
    z-index: 1;
    border-width: 0 2px 1px 0;
  }
  .wrap_item {
    margin-top: 10px;
  }
  .notLogin {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 200px;
    background-color: #3e9df8;
    padding-top: 30px;
    box-sizing: border-box;
    // 未登录
    .notLoginImg {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    .notLoginSpan {
      font-size: 18px;
      color: white;
      margin-top: 20px;
    }
  }
}
</style>