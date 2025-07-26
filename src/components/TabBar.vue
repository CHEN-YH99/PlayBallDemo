<template>
  <div class="tabbar-container">
    <van-tabbar v-model="active" safe-area-inset-bottom>
      <van-tabbar-item name="home" icon="home-o" @click="goToHome">
        <template #icon>
          <div class="custom-icon">
            <van-icon name="home-o" :color="active === 'home' ? '#FF976A' : '#7d7e80'" size="24" />
          </div>
        </template>
        <span :class="{ active: active === 'home' }">首页</span>
      </van-tabbar-item>

      <van-tabbar-item name="location" icon="location-o" @click="goToLocation">
        <template #icon>
          <div class="custom-icon">
            <van-icon name="location-o" :color="active === 'location' ? '#FF976A' : '#7d7e80'" size="24" />
          </div>
        </template>
        <span :class="{ active: active === 'location' }">场地</span>
      </van-tabbar-item>

      <van-tabbar-item name="publish" @click="onPublishClick">
        <template #icon>
          <div class="publish-button">
            <van-icon name="plus" color="#fff" size="24" />
          </div>
        </template>
        <span>发布</span>
      </van-tabbar-item>

      <van-tabbar-item name="message" icon="chat-o" @click="goToMessage">
        <template #icon>
          <div class="custom-icon">
            <van-icon name="chat-o" :color="active === 'message' ? '#FF976A' : '#7d7e80'" size="24" />
          </div>
        </template>
        <span :class="{ active: active === 'message' }">消息</span>
      </van-tabbar-item>

      <van-tabbar-item name="user" icon="user-o" @click="goToUser">
        <template #icon>
          <div class="custom-icon">
            <van-icon name="user-o" :color="active === 'user' ? '#FF976A' : '#7d7e80'" size="24" />
          </div>
        </template>
        <span :class="{ active: active === 'user' }">我的</span>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const active = ref('home');

// 根据当前路由设置激活状态
const setActiveFromRoute = () => {
  const path = route.path;

  // 判断是否为首页相关路径（包括所有运动类型）
  if (path === '/' ||
    path.includes('/basketball') ||
    path.includes('/football') ||
    path.includes('/badminton') ||
    path.includes('/tennis') ||
    path.includes('/pingpong') ||
    path.includes('/billiards') ||
    path.includes('/volleyball')) {
    active.value = 'home';
  } else if (path.includes('/location')) {
    active.value = 'location';
  } else if (path.includes('/message') || path.includes('/chat')) {
    active.value = 'message';
  } else if (path.includes('/user')) {
    active.value = 'user';
  }
};

// 组件挂载时设置初始状态
onMounted(() => {
  setActiveFromRoute();
});

// 监听路由变化
watch(() => route.path, () => {
  setActiveFromRoute();
});

// 导航方法
const goToHome = () => {
  router.push('/basketball');
};

const goToLocation = () => {
  router.push('/location');
};

const goToMessage = () => {
  router.push('/message');
};

const goToUser = () => {
  router.push('/user');
};

// 点击发布按钮时触发
const onPublishClick = () => {
  router.push('/publish');
};
</script>

<style lang="scss" scoped>
.tabbar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: #fff;
}

:deep(.van-tabbar) {
  height: 96px;
  /* 调整整体高度 */
}

:deep(.van-tabbar-item) {
  height: 96px;
  padding-bottom: 8px;
  /* 增加底部内边距 */

  .van-tabbar-item__text {
    font-size: 12px;
    margin-top: 10px;
    padding-bottom: 6px;
    /* 增加文字底部内边距 */
    color: #7d7e80;

    &.active {
      color: #FF976A;
    }
  }
}

.publish-button {
  width: 50px;
  height: 50px;
  background-color: #FF976A;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: 0px;
  /* 调整按钮位置，使其贴合在分割线下方 */
  margin-top: 0;
  /* 确保没有额外的上边距 */
  z-index: 10;
  /* 确保按钮在最上层 */
  box-shadow: 0 2px 8px rgba(255, 151, 106, 0.5);
}

/* 特别处理发布按钮的文字位置 */
:deep(.van-tabbar-item:nth-child(3)) {
  .van-tabbar-item__text {
    position: relative;
    top: -12px;
    /* 将"发布"文字向上移动更多 */
    font-size: 12px;
    color: #7d7e80;
  }
}

:deep(.van-tabbar-item--active) {
  .van-tabbar-item__text {
    color: #FF976A;
  }
}

.custom-icon {
  display: flex;
  justify-content: center;
}
</style>