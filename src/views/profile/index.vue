<template>
  <div class="profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="topBar"
      title="个人信息"
      right-text="保存"
      left-arrow
      @click-left="$router.back()"
      @click-right="save"
    />
    <!-- 上面单元组 -->
    <van-cell-group class="topProfile">
      <van-cell @click="$refs.photo.show = true" title="头像" is-link>
        <template slot="default">
          <img class="avatar" :src="userInfo.photo" alt />
        </template>
      </van-cell>
      <van-cell title="昵称" @click="nameShow = true" :value="userInfo.name" is-link />
      <van-cell title="介绍" @click="introShow = true" :value="userInfo.intro" is-link />
    </van-cell-group>
    <!-- 下面单元组 -->
    <van-cell-group>
      <van-cell title="性别" @click="genderShow = true" :value="userInfo.gender?'女':'男'" is-link />
      <van-cell title="生日" @click="birthShow = true" :value="userInfo.birthday" is-link />
    </van-cell-group>
    <!-- 弹出层 -->
    <photo ref="photo" @upAvatar="changeImg"></photo>
    <!-- 修改用户昵称的弹出层 -->
    <van-popup v-model="nameShow" position="bottom">
      <van-field v-model="userInfo.name" placeholder="请输入用户昵称" />
    </van-popup>
    <!-- 修改用户简介的弹出层 -->
    <van-popup v-model="introShow" position="bottom">
      <van-field v-model="userInfo.intro" placeholder="请输入用户简介" />
    </van-popup>
    <!-- 修改用户性别的弹出层 -->
    <van-popup class="genderPop" v-model="genderShow" position="bottom">
      <div class="gender_item" @click="userInfo.gender = 0;genderShow = false">男</div>
      <div class="gender_item" @click="userInfo.gender = 1;genderShow = false">女</div>
      <div class="gender_item" @click="genderShow = false">取消</div>
    </van-popup>
    <!-- 修改用户生日的弹出层 -->
    <van-popup v-model="birthShow" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="birthTrue"
        @cancel="birthShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
// 导入获取用户个人资料的接口
import { getUserInfo, getUserProfile, editUserProfile } from "@/api/user";
// 导入子组件
import photo from "./components/photo";
// 导入dayjs
import dayjs from "dayjs";

export default {
  name: "profile",
  // 注册子组件
  components: {
    photo
  },
  data() {
    return {
      // 用户的个人资料
      userInfo: {},
      //   修改用户昵称的弹出层默认隐藏
      nameShow: false,
      //   修改用户简介的弹出层默认隐藏
      introShow: false,
      //   修改用户性别的弹出层默认隐藏
      genderShow: false,
      //   修改用户生日的弹出层默认隐藏
      birthShow: false,
      // 当前时间
      currentDate: new Date(),
      //   时间选择器的最小时间
      minDate: new Date(1970, 0, 1),
      // 最大时间
      maxDate: new Date()
    };
  },
  methods: {
    // 子组件给父组件传值的方法
    changeImg(val) {
      //   console.log(val);
      // 给用户头像重新赋值
      this.userInfo.photo = val;
      // 隐藏弹出层
      this.$refs.photo.show = false;
    },
    // 时间选择器确认按钮的点击事件
    birthTrue() {
      //   console.log(dayjs(this.currentDate).format("YYYY-MM-DD"));
      // 把当前选择的时间赋值给用户生日
      this.userInfo.birthday = dayjs(this.currentDate).format("YYYY-MM-DD");
      // 隐藏弹出层
      this.birthShow = false;
    },
    // 保存用户修改的点击事件
    async save() {
      // 发送请求保存用户编辑后的数据
      await editUserProfile({
        name: this.userInfo.user,
        gender: this.userInfo.gender,
        birthday: this.userInfo.birthday,
        intro: this.userInfo.intro
      });
      // 弹出提示
      this.$toast.success("保存成功");
    }
  },
  // 页面一加载就调用的钩子函数
  async created() {
    // 页面一加载就请求用户的个人资料
    let res = await getUserInfo();
    // 给个人信息赋值
    this.userInfo = res.data;

    // 获取生日和性别
    res = await getUserProfile();
    this.$set(this.userInfo, "birthday", res.data.birthday);
    this.$set(this.userInfo, "gender", res.data.gender);
  }
};
</script>

<style lang="less" scoped>
.profile {
  .topBar {
    background-color: #3e9df8;
    i.van-icon.van-icon-arrow-left.van-nav-bar__arrow {
      color: white;
    }
    .van-nav-bar__title.van-ellipsis {
      color: white;
    }
    span.van-nav-bar__text {
      color: white;
    }
    span.van-nav-bar__text:active {
      background-color: transparent;
    }
  }
  .topProfile {
    margin-bottom: 10px;
    .avatar {
      width: 25px;
      height: 25px;
      border-radius: 50%;
    }
  }
  .genderPop {
    background-color: #f5f7f9;
    .gender_item {
      padding: 10px 0;
      text-align: center;
      height: 40px;
      line-height: 40px;
      background-color: white;
      &:last-child {
        margin-top: 10px;
      }
    }
  }
}
</style>