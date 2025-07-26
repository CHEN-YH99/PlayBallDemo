<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLocationStore } from './stores/locationStore.js';
import Head from "./components/Head.vue";
import NavBar from "./components/NavBar.vue";
import TabBar from "./components/TabBar.vue";
import GlobalLoginDialog from "./components/GlobalLoginDialog.vue";

const route = useRoute();
const locationStore = useLocationStore();

// 判断是否为纯净页面（聊天页面、聊天详情页面、个人中心页面、设置页面和好友详情页面）
const isPurePage = computed(() => {
  return route.path === '/message' || 
         route.path.startsWith('/chat/') || 
         route.path === '/user' || 
         route.path === '/settings' || 
         route.path.startsWith('/friend/');
});

// App初始化时获取位置信息
onMounted(async () => {
  // 初始化位置信息（只会执行一次）
  await locationStore.initializeLocation();
});
</script>

<template>
  <div class="app-container">
    <!-- 纯净页面：纯净布局 -->
    <template v-if="isPurePage">
      <router-view />
    </template>

    <!-- 其他页面：标准布局 -->
    <template v-else>
      <Head />
      <NavBar />
      <div class="main-content">
        <router-view />
      </div>
      <TabBar />
    </template>

    <!-- 全局登录弹窗组件 -->
    <GlobalLoginDialog />
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-top: 108px;
  /* Head(54px) + NavBar(约54px) 的高度 */
  margin-bottom: 96px;
  /* TabBar的高度 */
  background-color: #f5f5f5;
  overflow-y: auto;
}
</style>