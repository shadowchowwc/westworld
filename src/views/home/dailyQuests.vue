<template>
  <div class="container">
    <van-nav-bar title="副本任务" left-text="返回" left-arrow @click-left="onClickLeft" />
    <van-form @failed="onFailed" @submit="handleSubmit">
      <img style="width: 100%;" :src="require('@/assets/img/autoQuests.jpg')" alt="副本任务" />
      <p style="font-weight: bold;">使用方法：</p>
      <p>1. 选择需要执行的任务</p>
      <p>2. 点击【启动机器人】按钮</p>
      <p>3. 返回游戏界面</p>
      <p>4. 点击悬浮窗口的【开始】按钮</p>
      <div class="task-options">
        <van-radio-group v-model="groupChecked" direction="horizontal">
          <div class="radio-row">
            <van-radio name="normal2">精锐双本</van-radio>
            <van-radio name="normal3">精锐三本</van-radio>
          </div>
          <div class="radio-row">
            <van-radio name="highNormal3">神威三本</van-radio>
            <van-radio name="highNormal5">神威五本</van-radio>
          </div>
        </van-radio-group>
        <div class="select-ghost">
          <van-checkbox v-model="isInfiniteGhost">副本完成后无限抓鬼</van-checkbox>
        </div>
      </div>
      <div class="button-container">
        <van-button :disabled="!groupChecked" round @click="startNow" type="primary" native-type="submit">开始执行</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupChecked: 'highNormal5',  // 默认选择
      isInfiniteGhost: false,       // 是否无限抓鬼
    };
  },
  methods: {
    startNow() {
      // 调用自动化执行
      auto.invoke(
        'runRobot',
        [{ robot: require('@/auto/robot/robot.autoQuests'), params: { check: this.groupChecked, isInfiniteGhost: this.isInfiniteGhost } }],
        () => {
          // 执行后回调
        }
      );
    },
    stop() {
      // 停止执行
      auto.invoke('robotStop', [], () => {});
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
}

.task-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .radio-row {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;

    .van-radio {
      margin: 0 10px;
    }
  }

  .select-ghost {
    display: flex;
    justify-content: center;
    padding: 10px 0;
  }
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 10px 0;
}
</style>
