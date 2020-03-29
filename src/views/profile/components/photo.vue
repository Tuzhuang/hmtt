<template>
  <van-popup round class="photoPop" v-model="show">
    <div class="photo-item" @click="addFile">
      从相册选择
      <!-- 文件选择 -->
      <input ref="photoFile" @change="fileChange" type="file" style="display:none" />
    </div>
    <div class="photo-item" @click="$toast({message:'该功能需要调用专门的sdk接口，暂时未实现',icon:'smile-o'});show=false">拍照</div>
    <div class="photo-item">取消</div>
  </van-popup>
</template>

<script>
// 先导入预览图片的组件
import { ImagePreview } from "vant";
// 导入上传头像的接口
import { userPhoto } from "@/api/user";

export default {
  data() {
    return {
      // 弹出层默认隐藏
      show: false
    };
  },
  methods: {
    // 选择图片的事件
    addFile() {
      this.$refs.photoFile.click();
    },
    // 图片选择后触发的事件
    fileChange() {
      // 拿到刚刚选择的那个图片
      let file = this.$refs.photoFile.files[0];
      // 再将文件对象转成临时路径
      let url = URL.createObjectURL(file);
      //   console.log(url);
      // 要选择完图片之后再把预览图片显示出来
      ImagePreview({
        images: [url], // 这里用到的要是临时路径而不是对象
        showIndex: false, // 不显示页码
        onClose: () => {
          this.$dialog
            .confirm({
              message: "是否设置该图片为头像"
            })
            .then(async () => {
              // 调用上传头像的接口
              let res = await userPhoto({
                photo: file
              });
              // 弹出对话框
              this.$toast.success("用户头像设置成功");
              // 把获取到的网络路径传递给父组件
              this.$emit("upAvatar", res.data.photo);
            })
            .catch(() => {
              this.$toast("就这？就这就不改了？");
              // 隐藏弹出层
              this.show = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="less">
.photoPop {
  width: 80%;
  padding: 10px 10px;
  .photo-item {
    text-align: center;
    height: 40px;
    line-height: 40px;
  }
}
</style>