<template>
  <van-popup
    @closed="isDel = false"
    class="channel"
    v-model="show"
    position="left"
    closeable
    close-icon-position="top-left"
    round
    :style="{ width: '88%',height:'100%' }"
  >
    <!-- 我的频道 -->
    <div class="channel-top">
      <div class="channel-box">
        <span>我的频道</span>
        <van-button
          @click="isDel = !isDel"
          color="#f85a5a"
          plain
          round
          size="mini"
        >{{isDel?'完成':'编辑'}}</van-button>
      </div>
      <!-- 标签 -->
      <div class="tagBox" v-for="(item, index) in chanList" :key="index">
        <van-tag v-if="index !== 0" class="tag" round size="large">
          {{item.name}}
          <!-- 删除图标 -->
          <van-icon
            @click="delTag(item)"
            v-if="isDel"
            class="delIcon"
            color="black"
            size="large"
            name="clear"
          />
        </van-tag>
      </div>
    </div>
    <!-- 频道推荐 -->
    <div class="channel-bottom">
      <div class="channel-box">
        <span>频道推荐</span>
      </div>
      <!-- 标签 -->
      <van-tag
        @click="addTag(item)"
        class="tag"
        size="large"
        v-for="(item, index) in otherList"
        :key="index"
      >
        <van-icon class="addTag" name="add" />
        {{item.name}}
      </van-tag>
    </div>
  </van-popup>
</template>

<script>
// 导入获取全部频道的接口
import {
  getChanListAll,
  editUserChannels,
  delUserChannels
} from "@/api/channels.js";

export default {
  // 父传子
  props: {
    // 我的频道的数据
    chanList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      // 控制弹出层默认隐藏
      show: false,
      // 全部频道的数据  没有过滤前的全部数据
      allList: [],
      // 控制是否删除tag标签
      isDel: false
    };
  },
  methods: {
    // 获取全部频道的方法
    async getChanAll() {
      // 调用方法
      let res = await getChanListAll();
      // console.log(res);
      // 给全部频道数据赋值
      this.allList = res.data.channels;
    },
    // 频道推荐的标签的点击事件
    addTag(item) {
      // 要手动的添加每个频道与之对应的元素
      // 用来控制列表的刷新状态的，为false会调用onload事件，为true就不会调用
      this.$set(item, "loading", false);
      // 列表页是否加载到底部了，true代表是，false代表没到底
      this.$set(item, "finished", false);
      // 新闻列表页的数据源
      this.$set(item, "articList", []);
      // 用来控制上拉刷新的状态，为false代表不刷新了，为true代表正在刷新
      this.$set(item, "isLoading", false);
      // 第一次的事件戳要设置为当前的时间戳  因为不用在页面中显示，所以直接设置就可以了
      item.pre_time = Date.now();
      // 给我的频道的数据添加数据  添加之后因为使用的计算属性，他会自动更新执行一次，所以不用手动删除
      this.chanList.push(item);
      // 创建一个数组 channels 等于我的频道的数据去掉 推荐 的数据通过map方法生成
      let channels = this.chanList.slice(1).map((item, index) => {
        let obj = {
          id: item.id,
          seq: index + 1
        };
        return obj;
      });
      // 发送请求修改用户频道列表的数据
      editUserChannels({ channels });
    },
    // 删除按钮的点击事件
    delTag(item) {
      // 从我的频道中删除该tag标签
      for (let i = 0; i < this.chanList.length; i++) {
        if (this.chanList[i] == item) {
          // 就删掉这个tag标签
          this.chanList.splice(i, 1);
        }
      }
      // 调用接口，发送请求修删除频道数据
      delUserChannels({ channels: [item.id] });
      // delUserChannels(item.id);
    }
  },
  // dom一加载就调用获取全部频道的方法
  mounted() {
    this.getChanAll();
  },
  // 计算属性
  computed: {
    otherList() {
      // 先把我的频道中的id找出来
      let ids = this.chanList.map(item => {
        return item.id;
      });
      // console.log(ids);
      return this.allList.filter(item => {
        // 判断遍历的每一个频道是否在我的频道里面
        return !ids.includes(item.id);
      });
    }
  }
};
</script>

<style lang="less">
.channel {
  padding: 60px 10px;
  box-sizing: border-box;
  i.van-icon.van-icon-cross.van-popup__close-icon.van-popup__close-icon--top-left {
    color: black;
  }
  .channel-box {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
  }
  .tagBox {
    display: inline-block;
    .delIcon {
      margin-left: 10px;
    }
  }
  .tag {
    padding: 5px 10px;
    margin-right: 10px;
    margin-bottom: 10px;
    background-color: #dddddd;
    color: black;
  }
  .channel-bottom {
    // margin-top: 40px;
    .addTag {
      margin-right: 10px;
      font-size: 18px;
    }
  }
}
</style>