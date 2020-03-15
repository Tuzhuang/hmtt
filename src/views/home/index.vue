<template>
  <div class="home">
    <div class="top-bar">
      <!-- 左侧图标 -->
      <van-icon @click="btnShow" class="top-icon" name="wap-nav" />
      <!-- 输入框 -->
      <van-search class="top-search" shape="round" background="#3194ff" placeholder="请输入搜索关键词" />
      <!-- 右侧图标 -->
      <van-icon class="top-icon" name="search" />
    </div>
    <!-- 频道部分  标签页 -->
    <van-tabs v-model="active">
      <van-tab
        v-for="(item, index) in chanDataList"
        :key="index"
        :name="item.id"
        :title="item.name"
      >
        <!-- 上拉刷新 -->
        <van-pull-refresh v-model="item.isLoading" @refresh="onRefresh(item)">
          <!-- 内容区 -->
          <van-list
            v-model="item.loading"
            :finished="item.finished"
            finished-text="没有更多了"
            @load="onLoad(item)"
          >
            <van-cell v-for="(item1,index1) in item.articList" :key="index1" :title="item1.title">
              <template slot="title">
                <!-- 标题部分 -->
                <div class="title">
                  <span>{{item1.title}}</span>
                  <!-- 单个图片显示 -->
                  <img
                    class="titImg"
                    v-if="item1.cover.type === 1"
                    :src="item1.cover.images[0]"
                    alt
                  />
                </div>
                <div v-if="item1.cover.type === 0" class="place"></div>
                <!-- 图片宫格部分 -->
                <van-grid v-if="item1.cover.type === 3" :border="false" :column-num="3">
                  <van-grid-item v-for="(item2, index2) in item1.cover.images" :key="index2">
                    <van-image class="gridImg" :src="item2" />
                  </van-grid-item>
                </van-grid>
                <!-- 作者、评论、时间 -->
                <div class="info">
                  <div class="info-span">
                    <span>{{item1.aut_name}}</span>
                    <span>评论数 {{item1.comm_count}}</span>
                    <!-- 使用过滤器 -->
                    <span>{{item1.pubdate | filterTime}}</span>
                  </div>
                  <div class="more">
                    <van-icon @click="more(item1,item.articList)" name="smile-o" />
                  </div>
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 使用弹出层  父组件给子组件传值 -->
    <channel ref="channel" :chanList="chanDataList"></channel>
    <!-- 使用弹出层 不感兴趣那一列 -->
    <more ref="more"></more>
  </div>
</template>

<script>
// 导入接口文件
import { getChanList } from "@/api/channels.js";
import { getArtiList } from "@/api/articles.js";

// 导入封装后的弹出层组件
import channel from "./components/channel.vue";
import more from "./components/more.vue";

export default {
  name: "home",
  // 注册一下
  components: {
    channel,
    more
  },
  data() {
    return {
      // 标签页的默认选中第一条
      active: 0,
      // 用户频道列表的数据
      chanDataList: []
    };
  },
  methods: {
    // 上拉刷新触发的事件
    async onLoad(item) {
      // 发送请求
      let res = await getArtiList({
        channel_id: item.id,
        timestamp: item.pre_time, // 时间戳要设置为上一次的时间戳
        with_top: 1 // 是否包含置顶
      });
      // console.log(res);
      // 给列表页数据赋值
      let arr = res.data.results;
      //  判断当前列表是否有数据
      if (arr.length === 0) {
        // 说明没有数据了 ,就说明数据已经加载到底部了
        item.finished = true;
      } else {
        // 请求到下一页的数据的时候要保存上一次的时间戳
        item.pre_time = res.data.pre_timestamp;
        // 上拉刷新的时候加载更多
        item.articList.push(...arr);
        item.loading = false;
      }
    },
    // 下拉刷新（往下拽）就会触发的事件
    async onRefresh(item) {
      // 把当前时间戳改成最新的事件戳
      item.pre_time = Date.now();
      // 还要把loading状态改成false，这样代表可以重新加载一些新的数据
      item.loading = false;
      // 把finished也改成false，因为有可能你下拉的时候，已经结束了上拉的状态
      item.finished = false;
      // 调用获取用户频道列表的方法
      // this.onLoad(item);
      let res = await getArtiList({
        channel_id: item.id,
        timestamp: item.pre_time, // 时间戳要设置为上一次的时间戳
        with_top: 1 // 是否包含置顶
      });
      // 将列表的数组重新赋值
      item.articList = res.data.results;
      // 停止刷新 将加载中隐藏
      item.isLoading = false;
    },
    // 获取用户频道列表的方法
    async getChanData() {
      // 调用接口
      let res = await getChanList();
      // console.log(res);
      // 给用户频道列表的数据赋值
      this.chanDataList = res.data.channels;
      // 给每个单独的频道添加单独属于自己的属性
      this.chanDataList.forEach(item => {
        // 因为下面的这些属性在data中没有被定义，所以，修改的时候页面上不会进行实时修改，所以要用$set来修改
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
      });
    },
    // 菜单栏的点击事件
    btnShow() {
      // 让子组件的弹出层显示出来
      this.$refs.channel.show = true;
    },
    // 单元行更多的点击事件
    more(item, list) {
      // 让弹出层显示出来
      this.$refs.more.show = true;
      // 给子组件的文章id和文章列表赋值
      this.$refs.more.art_id = item.art_id;
      this.$refs.more.art_list = list;
      // 给子组件的用户id赋值
      this.$refs.more.aut_id = item.aut_id;
    }
  },
  created() {
    // 页面一加载就请求获取用户频道列表的方法
    this.getChanData();
  }
  // // 过滤器
  // filters: {
  //   filterTime(val){
  //     return dayjs().form(dayjs(val));
  //   }
  // }
};
</script>

<style lang="less" scoped>
.home {
  padding-top: 54px;
  padding-bottom: 100px;
  /deep/.top-bar {
    display: flex;
    align-items: center;
    background-color: #3194ff;
    padding: 0 14px;
    // 固定定位
    position: fixed;
    top: 0;
    z-index: 999;
    width: 100%;
    box-sizing: border-box;
    .top-icon {
      font-size: 22px;
      color: white;
    }
    .top-search {
      // 表示占用剩下部分的全部
      flex: 1;
    }
  }

  /deep/.van-tabs--line .van-tabs__wrap {
    height: 44px;
    position: fixed;
    width: 100%;
    z-index: 999;
  }
  .van-list {
    margin-top: 44px;
  }
  .info {
    display: flex;
    justify-content: space-between;
    .info-span {
      font-size: 12px;
      color: #ccc;
      span {
        margin-right: 10px;
      }
    }
    .more {
      font-size: 18px;
      color: blueviolet;
    }
    .vanImage {
      width: 33.33%;
    }
  }
  .title {
    display: flex;
    justify-content: space-between;
    .titImg {
      display: inline-block;
      height: 120px;
    }
  }
  .gridImg {
    display: inline-block;
    width: 100%;
  }
  .place {
    height: 30px;
  }
}
</style>