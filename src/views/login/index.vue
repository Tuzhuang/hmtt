<template>
  <div class="login">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />
    <!-- 输入框 -->
    <van-field v-model="form.mobile" placeholder="请输入手机号" :error-message="valid.mobile">
      <template slot="left-icon">
        <i class="iconfont icon-mobile"></i>
      </template>
    </van-field>
    <van-field v-model="form.code" placeholder="请输入验证码" :error-message="valid.code">
      <template slot="left-icon">
        <i class="iconfont icon-lock"></i>
      </template>
      <van-button slot="button" size="small" round>发送验证码</van-button>
    </van-field>
    <!-- 按钮 -->
    <van-button
      @click="btnLogin"
      :loading="isLoading"
      loading-type="spinner"
      loading-text="登录中..."
    >登录</van-button>
  </div>
</template>

<script>
// 导入需要用到的接口请求
import { login } from "@/api/login.js";
// 导入保存token的方法
import { setToken } from "@/utilis/token.js";

export default {
  data() {
    return {
      // 错误提示的信息对象
      valid: {
        mobile: "",
        code: ""
      },
      // 输入框的验证
      form: {
        mobile: "18511111111",
        code: "246810"
      },
      //   是否执行动画的bool值
      isLoading: false
    };
  },
  methods: {
    //   登录按钮的点击事件
    async btnLogin() {
      // 点击登录的时候先判断验证是否通过
      if (this.isLoginTrue()) {
        // 点击登录按钮的时候，让动画显示出来
        this.isLoading = true;
        // 如果验证成功的时候就发送请求
        try {
          let res = await login(this.form);
          // console.log(res);
          // 登录成功的时候给vuex中的token赋值
          this.$store.commit("changeToken", res.data.token);
          this.$store.commit("changeRefToken", res.data.refresh_token);
          // 不仅要在vuex中保村还要在localstorage中也保存一下
          setToken(res.data);
          // 登录成功的时候判断一下当前的路径来进行跳转
          if (this.$route.path == "/login") {
            // 登录成功之后跳转到登录页面
            this.$router.push("/home");
          } else {
            // 否则就从哪来回哪去  登录成功跳转路径的时候应该是从哪来就回哪去
            this.$router.back();
          }
        } catch (error) {
          // 代码报错的时候应该弹出提示
          this.$toast.fail("用户名或验证码错误");
        } finally {
          // 不管代码执行成功还是失败都会执行的
          // 不管成功还是失败，只要结果出来了，就停止动画
          this.isLoading = false;
        }

        // 以下是还没有优化的时候写的接口调用

        // try catch 用来捕捉错误
        // try{
        //     let res = await axios({
        //       method: "post",
        //       url: "http://ttapi.research.itcast.cn/app/v1_0/authorizations",
        //       data: {
        //         mobile: this.form.mobile,
        //         code: this.form.code
        //       }
        //     })
        //     console.log(res);
        // }catch{
        //     // 如果 try 里面的内容执行错误那就回执行catch里面的内容
        //     console.log('try里面的内容报错了')
        // }finally{
        //     // 不管成功还是失败都会执行
        //     console.log('不管成功还是失败都会执行')
        // }
      }
    },
    // 错误提示验证的方法
    isLoginTrue() {
      // 先声明一个变量 默认验证通过
      let flag = true;
      // 判断手机号是否验证成功
      if (/0?(13|14|15|18|17)[0-9]{9}/.test(this.form.mobile)) {
        // 验证成功的时候把错误提示的值清空
        this.valid.mobile = "";
      } else {
        // 给错误信息的提示赋值
        this.valid.mobile = "手机号格式不正确";
        // 给变量设置为false
        flag = false;
      }
      // 再判断验证码格式是否正确
      if (this.form.code.length === 6) {
        // 验证成功的时候把验证码错误的提示信息设置为空
        this.valid.code = "";
      } else {
        // 验证失败的时候给错误的提示信息赋值
        this.valid.code = "验证码格式不正确";
        // 设置为false
        flag = false;
      }
      // 把最后的值返回出去
      return flag;
    }
  }
};
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-color: #f5f7f9;
  .van-nav-bar.van-hairline--bottom {
    background-color: #3e9df8;
    .van-nav-bar__title.van-ellipsis {
      color: white;
    }
  }
  button.van-button.van-button--default.van-button--small.van-button--round {
    background-color: #ededed;
    color: #666666;
  }
  button.van-button.van-button--default.van-button--normal {
    width: 90%;
    height: 50px;
    display: block;
    margin: 25px auto;
    background-color: #1989fa;
    color: white;
    border-radius: 5px;
  }
}
</style>