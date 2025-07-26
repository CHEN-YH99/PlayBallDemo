<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 标签导航的数据
const activeSport = ref(0); // 默认激活第一个标签
const sportTabs = [
  { name: '篮球', path: '/basketball' },
  { name: '足球', path: '/football' },
  { name: '羽毛球', path: '/badminton' },
  { name: '网球', path: '/tennis' },
  { name: '乒乓球', path: '/pingpong' },
  { name: '台球', path: '/billiards' },
  { name: '排球', path: '/volleyball' }
];

// 根据当前路由设置激活的标签
const setActiveTabFromRoute = () => {
  const currentPath = route.path;
  const index = sportTabs.findIndex(tab => tab.path === currentPath);
  if (index !== -1) {
    activeSport.value = index;
  }
};

// 标签切换时的路由跳转
const onTabChange = (index) => {
  const targetTab = sportTabs[index];
  if (targetTab && route.path !== targetTab.path) {
    router.push(targetTab.path);
  }
};

// 监听路由变化
watch(() => route.path, () => {
  setActiveTabFromRoute();
});

// 组件挂载时设置初始状态
onMounted(() => {
  setActiveTabFromRoute();
});
</script>

<template>
  <!-- 新增的标签导航部分 -->
  <div class="sport-tabs-container">
    <van-tabs
      v-model:active="activeSport"
      animated
      sticky
      line-width="20px"
      line-height="3px"
      color="#1989fa"
      title-active-color="#1989fa"
      title-inactive-color="#666"
      @change="onTabChange"
    >
      <van-tab 
        v-for="(item, index) in sportTabs" 
        :key="index" 
        :title="item.name"
      ></van-tab>
    </van-tabs>
    <div class="separator-line"></div>
  </div>
</template>



<style scoped lang="scss">
.sport-tabs-container {
  position: fixed;
  top: 54px;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  padding-top: 8px; /* 顶部内边距 */
  padding-bottom: 8px; /* 底部内边距 */

  .van-tabs {
    --van-tabs-line-color: #1989fa; /* 设置指示器颜色 */
    --van-tabs-bottom-bar-color: #1989fa; /* 确保指示器颜色一致 */
    .van-tab {
      font-size: 16px; /* 调整字体大小 */
      font-weight: normal; /* 非激活状态的字体粗细 */
      &.van-tab--active {
        font-weight: bold; /* 激活状态的字体加粗 */
      }
    }
  }

  .separator-line {
    width: calc(100% - 32px); /* 宽度减去左右padding */
    height: 1px;
    background-color: #e6e6e6; /* 灰色线条 */
    margin: 10px auto 0; /* 居中并设置顶部间距 */
  }
}
</style>