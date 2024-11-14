<template>
  <div class="container">
    <van-nav-bar title="通宵捉鬼" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-form @failed="onFailed" @submit="handleSubmit">
      <section class="instructions">
        <p style="font-weight: bold;">使用方法：</p>
        <p>1、进入本页面，点击下方【开始捉鬼】按钮</p>
        <p>2、启动梦幻西游手游app</p>
        <p>3、提前组好队伍并置于长安城</p>
        <p>4、到钟馗那领取捉鬼任务（如下）</p>
        <img style="width: 100%;" src="@/assets/img/zhuaGui.jpg" alt="任务示例" />
        <p>5、点击悬浮窗口【开始】按钮即可</p>
      </section>      
      <div class="button-container">
        <van-button round block type="primary" native-type="submit">开始捉鬼</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      times: 10
    };
  },
  methods: {
    // 表单验证失败的处理方法
    onFailed(info) {
      console.log(info);
    },
    // 表单提交处理方法
    handleSubmit(values) {
      console.log(values);
      auto.invoke(
        'runRobot',
        [{ robot: require('@/auto/robot/robot.five'), params: values }],
        () => {
          console.log('完成回调');
        }
      );
    },
    // 返回按钮点击事件
    onClickLeft() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 16px;
}

.instructions {
  margin-bottom: 16px;
}

.task-image {
  width: 100%;
}

.button-container {
  margin: 16px 0;
}
</style>
