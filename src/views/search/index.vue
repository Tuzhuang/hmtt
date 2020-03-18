<template>
  <div class="search">
    <div class="topBar">
      <!-- 输入框 -->
      <van-search
        @input="search"
        @keydown.enter="searchDown(txtVal)"
        v-model="txtVal"
        class="top-search"
        shape="round"
        background="#3194ff"
        placeholder="请输入搜索关键词"
      />
      <!-- 右侧图标 -->
      <van-button @click="$router.back()" plain hairline type="info" round size="mini">取消</van-button>
    </div>
    <!-- 历史记录 -->
    <div v-if="suggesList.length == 0" class="history">
      <div class="topHis">
        <span>历史记录</span>
        <van-icon @click="delAll" class="delIcon" name="delete" />
      </div>
      <div v-if="historyData.length != 0" class="hisCon">
        <van-row class="hisRow">
          <van-col
            @click="searchDown(item)"
            class="hisCol"
            span="12"
            v-for="(item, index) in historyData"
            :key="index"
          >
            {{item}}
            <!-- 阻止事件冒泡 -->
            <van-icon @click.stop="delItem(index)" class="hisClose" name="close" />
          </van-col>
        </van-row>
      </div>
      <!-- 暂无数据 -->
      <div v-else class="notData">
        暂无搜索记录
        <p>(代码可以烂，但一定要够sao)</p>
      </div>
    </div>
    <!-- 搜索词汇建议区域 -->
    <div v-else class="sugges">
      <van-cell-group>
        <van-cell
          v-for="(item, index) in suggesList"
          :key="index"
          @click="$router.push(`/searchResult/${item.oldItem}`)"
          icon="search"
        >
          <template slot="title">
            <div v-html="item.newItem"></div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
// 导入搜索联想的接口
import { suggestion } from "@/api/search";
// 导入解决函数抖动的方法
// import { fangdou } from "@/utilis/fdou.js";
// 导入操作local的方法
import { setLocal, getLocal, removeLocal } from "@/utilis/local.js";

export default {
  data() {
    return {
      // 搜索词汇和历史记录的显示控制
      isSearch: true,
      // 输入框绑定的值
      txtVal: "",
      // 搜索联想的数据源
      suggesList: [],
      // 防止抖动设置的计时器id
      timerID: null,
      // 历史记录的数据
      historyData: getLocal("historyData") || []
    };
  },
  methods: {
    // 搜索框搜索内容时就触发的事件
    search() {
      // 先清除掉上一次的计时器
      clearTimeout(this.timerID);
      // 防止每次只要一输入就触发请求，所以要解决防抖
      this.timerID = setTimeout(async () => {
        // fangdou(async () => {
        // 发送请求之前 判断当前输入框的值不为空的时候再发请求
        if (this.txtVal === "") {
          // 就把搜索联想的数组清空
          this.suggesList = [];
        } else {
          // 发送请求获取搜索联想的词语
          let res = await suggestion({
            q: this.txtVal
          });
          console.log("res");
          // 给搜索联想的数据源赋值
          this.suggesList = res.data.options;
          // 给当前输入的关键词高亮显示
          this.suggesList = this.suggesList.map(item => {
            // 先统一转成小写再做替换
            // 不直接return 要审查各行一个对象，把修改之前的字符串和修改之后的字符串都保存起来
            let str = item
              .toLowerCase()
              .replace(
                this.txtVal.toLowerCase(),
                `<span style="color:red;font-weight: bold;"> ${this.txtVal} </span>`
              );

            // 返回一个对象
            return {
              oldItem: item,
              newItem: str
            };
          });
        }
        // }, 200);
      }, 300);
    },
    // 输入框的回车事件
    searchDown(txtVal) {
      // 将搜索的关键词保存到历史记录的数组中
      this.historyData.unshift(txtVal);
      // 把历史记录中的数据进行去重
      let set = new Set(this.historyData);
      // 把去重后的数据重新遍历放到数组中
      this.historyData = [...set];
      // 要把当前数据保存到本地的local中
      setLocal("historyData", JSON.stringify(this.historyData));
      // 跳转路由
      this.$router.push(`/searchResult/${txtVal}`);
    },
    // 删除所有历史记录的方法
    delAll() {
      // 将保存历史记录的数组清空
      this.historyData = [];
      // 调用local方法删除
      removeLocal("historyData");
    },
    // 删除单个记录的事件
    delItem(index) {
      // 从数组中删除这个元素
      this.historyData.splice(index, 1);
      // 再将数据重新保存到本地
      setLocal("historyData", JSON.stringify(this.historyData));
    }
  }
};
</script>

<style lang="less">
.search {
  width: 100%;
  height: 100%;
  background-color: #f5f7f9;
  .topBar {
    display: flex;
    align-items: center;
    background-color: #3194ff;
    padding-right: 10px;
    .top-search {
      width: 88%;
    }
    .top-icon {
      font-size: 22px;
    }
  }
  .history {
    width: 100%;
    background-color: white;
    margin-top: 20px;
    .topHis {
      display: flex;
      height: 40px;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      .delIcon {
        font-size: 20px;
      }
    }
    .hisCon {
      margin-top: 10px;
      .hisRow {
        .hisCol {
          height: 40px;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          border-top: 1px solid #e8e8e8;
          &.hisCol:nth-of-type(1n) {
            border-right: 1px solid #e8e8e8;
          }
          .hisClose {
            position: absolute;
            right: 10px;
            font-size: 18px;
            color: #cccccc;
          }
        }
      }
    }
    .notData {
      width: 100%;
      height: 150px;
      text-align: center;
      padding-top: 20px;
      box-sizing: border-box;
      font-size: 24px;
      color: pink;
      p {
        font-size: 14px;
        margin-top: 40px;
      }
    }
  }
}
</style>