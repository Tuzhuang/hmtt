<template>
  <div class="reply">
    <!-- 弹出层 -->
    <van-popup
      class="myPopup"
      v-model="show"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '66%' }"
    >
      <!-- 标题 关闭按钮-->
      <div class="topBar">
        <p class="topTitle">{{cellData.reply_count}}条回复</p>
      </div>
      <van-list v-model="loading" :finished="finished" finished-text="我也是有底线的..." @load="onLoad">
        <!-- 评论 -->
        <van-cell class="title" v-for="(item, index) in replyCommList" :key="index">
          <template slot="title">
            <div class="info">
              <img class="icon" :src="item.aut_photo" alt />
              <div class="aut_info">
                <div class="aut_name">{{item.aut_name}}</div>
                <div class="commcon">{{item.content}}</div>
                <div class="bottom">
                  <span class="time">{{item.pubdate | filterTime}}</span>
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
      <!-- // 使用写评论的子组件  给子组件传值 -->
      <!-- // 子组件给父组件传值，父组件接收 -->
      <write
        class="reply_write"
        :isRaply="true"
        :com_id="cellData.com_id"
        :reply_list="replyCommList"
        @addCount="cellData.reply_count++"
      ></write>
    </van-popup>
  </div>
</template>

<script>
// 导入用来进行兄弟组件之间传值的bus文件
import Bus from "@/utilis/bus.js";
// 导入获取评论回复的接口
import { getComments } from "@/api/comment";
// 导入写评论的子组件
import write from "./write";

export default {
  // 注册使用子组件
  components: {
    write
  },
  data() {
    return {
      // 弹出层默认隐藏
      show: false,
      // 控制是否可以加载更多数据，为false代表可以加载更多数据
      loading: false,
      // 控制数据是否已经加载完毕，为true代表数据加载完毕了
      finished: false,
      // 评论回复的数据源
      replyCommList: [],
      // 被点击的文章id
    //   com_id: 0,
      // 获取数据偏移量 需要传入的是当前页的last_id
      offset: undefined,
      // 评论总条数
    //   total_count: 0,
      // 当前行的数据，从comment传递过来的数据
      cellData: {}
    };
  },
  methods: {
    // 获取评论回复的方法 上拉就会触发的事件
    async onLoad() {
      let res = await getComments({
        // 评论类型
        type: "c",
        // 文章评论的id
        // 评论id是一个对象，所以要调用toString方法，将他转换成字符串
        // 如果是get请求，但是参数是路径参数，那么也可以不用调用toString方法，他的内部会帮你调用
        source: this.cellData.com_id.toString(),
        // 获取数据偏移量 需要传入的是当前页的last_id
        offset: this.offset,
        // 获取评论的数据
        limit: 10
      });
      // console.log(res);
      // 给评论回复的数据源赋值
      this.replyCommList.push(...res.data.results);
      // 然后再把本次的last_id赋值给offset作为请求下一页数据的标识
      this.offset = res.data.last_id;
      // 再把loading设置为false。标识可以加载更多数据
      this.loading = false;
      // 给评论总条数赋值
      this.total_count = res.data.total_count;
      // 用bus文件给兄弟组件传值
      Bus.$emit("replyComm", this.cellData.reply_count);
      // 判断当end_id和lase_id相等的时候代表此时的数据已经全部加载完毕
      if (res.data.end_id === res.data.last_id) {
        // 将finished设置为true，代表数据加载完毕了
        this.finished = true;
      }
    }
  },
  // 最早可以访问data中属性的钩子函数
  created() {
    // 用bus文件接收兄弟组件传过来的值
    Bus.$on("replyPop", data => {
      // 把弹出层的值设置为true
      this.show = true;
      //   console.log(data);
      // 把传递过来的文章数据赋值给当前文章数据
      this.cellData = data;
      // 其他值设置为默认值
      this.loading = false;
      this.finished = false;
      // 把数据源清空
      this.replyCommList = [];
      // 把offset设置为undefined，代表请求第一页的数据
      this.offset = undefined;
    });
  }
};
</script>

<style lang="less">
.reply {
  .myPopup {
    i.van-icon.van-icon-cross.van-popup__close-icon.van-popup__close-icon--top-left {
      color: black;
      margin-top: -4px;
      font-size: 24px;
    }
    .topBar {
      display: flex;
      align-items: center;
      .topTitle {
        font-size: 20px;
        margin: 0 auto;
        margin-top: 10px;
      }
    }
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
    .reply_write {
      margin-top: 88px;
    }
  }
}
</style>