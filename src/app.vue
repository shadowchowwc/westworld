<template>
  <RouterView/>
</template>

<script>
import robotScript from '@/auto/global/robot.screencapture.js';

export default {
  async created() {
    try {
      await auto.invoke('runRobotNow', [{ robot: robotScript }]);
      console.log('调用全局截图权限');
    } catch (error) {
      console.error('调用截图权限时出错:', error);
    }
  }
}
</script>

<style lang="less">
@fontSize: 20px;

*,
*::before,
*::after {
  box-sizing: border-box;
}

#app {
  width: 100vh;
  height: 100vh;
  overflow: hidden;
}

.container {
  font-size: @fontSize;

  p {
    margin: 5px 0;
    text-indent: 2em;
  }

  img {
    width: 80%;
  }
}
</style>
