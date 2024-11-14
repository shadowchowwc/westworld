<template>
<div class="home">
  <div class="list">
    <div :class="'item ' + item.class" v-for="item in list" :key="item.route" @click="goPage(item)">
      {{ item.title }}
    </div>
  </div>
</div>
</template>







<style lang="less">
  .home {
    .list {
      display: flex;
      flex-wrap: wrap;
      &::after {
        content: '';
        position: absolute;
        z-index: -1;
        background-color: inherit;
        width: 100%;
        height: 100%;
        left: 0;
        bottom: -10%;
        border-radius: 5px;
        opacity: 0.2;
        transform: scale(0.9);
      }
    }

    .item {
      flex: 0 0 45%;
      height: 90px;
      margin: 10px 2.5%;
      border-radius: 6px;
      padding: 15px;
      background-image: url('~@/assets/img/gray-float.png');
      background-size: cover;
      background-position: center;
      position: relative;
      z-index: 1;
      font-size: 16px;
    }

    .van-dialog__message {
      text-align: left;
    }
  }

  .bg-black {
    background-color: #333333;
    color: #ffffff;
  }
  
</style>
