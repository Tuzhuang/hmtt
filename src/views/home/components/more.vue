<template>
  <div class="more">
    <!-- 弹出层 -->
    <van-popup v-if="isFirst" round v-model="show" :style="{ width: '88%' }">
      <van-cell-group>
        <van-cell @click="dislikes" icon="failure" title="不感兴趣" />
        <van-cell @click="isFirst=false" icon="warning-o" title="反馈垃圾内容" is-link />
        <van-cell @click="blacklists" icon="delete" title="拉黑作者" />
      </van-cell-group>
    </van-popup>
    <!-- 举报的弹出层 -->
    <van-popup @closed="repoClose" v-else v-model="show" round :style="{ width: '88%' }">
      <van-cell-group>
        <van-cell @click="isFirst=true" icon="arrow-left"></van-cell>
        <van-cell
          @click="reports(item.type)"
          v-for="(item, index) in reportList"
          :key="index"
          :title="item.title"
        ></van-cell>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
// 导入不喜欢该文章的接口
import { dislikes, reports, blacklists } from "@/api/articles.js";

export default {
  data() {
    return {
      // 弹出层默认隐藏
      show: false,
      //   文章id
      art_id: 0,
      // 文章列表
      art_list: [],
      //   反馈垃圾内容的数据源
      reportList: [
        { type: 1, title: "标题夸张" },
        { type: 2, title: "低俗色情" },
        { type: 3, title: "错别字多" },
        { type: 4, title: "旧闻重复" },
        { type: 5, title: "广告软文" },
        { type: 6, title: "内容不实" },
        { type: 7, title: "涉嫌违法犯罪" },
        { type: 8, title: "侵权" },
        { type: 0, title: "其他问题" }
      ],
      // 标记是否为第一个面板  当前弹出层显示的规则
      isFirst: true,
      //   举报的内容
      remark: "你触摸我干啥？",
      //   用户id
      aut_id: 0
    };
  },
  methods: {
    // 不感兴趣的点击事件
    async dislikes() {
      // 点击不感兴趣的时候要把当前文章删掉
      for (let i = 0; i < this.art_list.length; i++) {
        // 判断当前传入的id是否在数组中
        if (this.art_list[i].art_id === this.art_id) {
          // 删除当前文章
          this.art_list.splice(i, 1);
          // 发送请求从服务器中删掉该文章
          await dislikes(this.art_id);
          // 找到之后就break 退出循环
          break;
        }
      }
      // 隐藏弹出层
      this.show = false;
      this.$toast("以后将减少此类内容的推送");
    },
    // 举报文章的点击事件
    async reports(type) {
      // 循环数组找到当前要举报的文章，把他删掉
      for (let i = 0; i < this.art_list.length; i++) {
        if (this.art_id.toString() === this.art_list[i].art_id.toString()) {
          // 删掉该文章
          this.art_list.splice(i, 1);
          // 就调用接口对文章进行举报
          await reports({
            target: this.art_id.toString(),
            type: type,
            remark: this.remark
          });
          // 删除成功之后就退出循环
          break;
        }
      }
      // 消息提示
      this.show = false;
      this.$toast("反馈成功");
    },
    // 举报弹出层的关闭后的事件
    repoClose() {
      this.isFirst = true;
    },
    // 拉黑用户的点击事件
    async blacklists(aut_id) {
      // 先循环遍历找到当前用户id并删掉它
      for (let i = 0; i < this.art_list.length; i++) {
        if (this.aut_id === this.art_list[i].aut_id) {
          // 找到当前用户id就删掉它
          this.art_list.splice(i, 1);
          // 调用接口拉黑作者
          await blacklists(this.aut_id);
          // 删掉之后就退出循环
          break;
        }
      }
      // 消息提示
      this.show = false;
      this.$toast.success("拉黑成功");
    }
  }
};
</script>

<style>
</style>