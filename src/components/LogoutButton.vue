<template>
  <div class="logout-container">
    <!-- 简单的退出按钮 -->
    <van-button 
      v-if="simple"
      type="danger" 
      :size="size"
      :round="round"
      :block="block"
      @click="handleLogout"
      :loading="userStore.loading.logout"
    >
      <van-icon name="sign" />
      {{ text }}
    </van-button>

    <!-- 带确认的退出按钮 -->
    <van-button 
      v-else
      type="danger" 
      :size="size"
      :round="round"
      :block="block"
      @click="showLogoutConfirm"
      :loading="userStore.loading.logout"
    >
      <van-icon name="sign" />
      {{ text }}
    </van-button>

    <!-- 退出确认弹窗 -->
    <van-dialog
      v-model:show="showConfirm"
      title="确认退出"
      message="确定要退出登录吗？"
      show-cancel-button
      confirm-button-text="确定退出"
      cancel-button-text="取消"
      confirm-button-color="#ee0a24"
      @confirm="handleLogout"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.js';
import { showToast, showSuccessToast } from 'vant';

// Props
const props = defineProps({
  // 是否简单模式（不显示确认弹窗）
  simple: {
    type: Boolean,
    default: false
  },
  // 按钮文字
  text: {
    type: String,
    default: '退出登录'
  },
  // 按钮尺寸
  size: {
    type: String,
    default: 'normal'
  },
  // 是否圆角
  round: {
    type: Boolean,
    default: false
  },
  // 是否块级元素
  block: {
    type: Boolean,
    default: false
  },
  // 退出后是否跳转到首页
  redirectToHome: {
    type: Boolean,
    default: true
  },
  // 自定义跳转路径
  redirectPath: {
    type: String,
    default: '/'
  }
});

// Emits
const emit = defineEmits(['logout', 'before-logout', 'after-logout']);

const router = useRouter();
const userStore = useUserStore();
const showConfirm = ref(false);

// 显示退出确认弹窗
const showLogoutConfirm = () => {
  showConfirm.value = true;
};

// 处理退出登录
const handleLogout = async () => {
  try {
    // 触发退出前事件
    emit('before-logout');
    
    // 执行退出登录
    await userStore.logout();
    
    // 显示成功提示
    showSuccessToast('已退出登录');
    
    // 触发退出后事件
    emit('after-logout');
    
    // 关闭确认弹窗
    showConfirm.value = false;
    
    // 跳转处理
    if (props.redirectToHome) {
      router.push(props.redirectPath);
    }
    
    // 触发自定义退出事件
    emit('logout');
    
  } catch (error) {
    showToast('退出登录失败，请重试');
  }
};
</script>

<style lang="scss" scoped>
.logout-container {
  .van-button {
    .van-icon {
      margin-right: 4px;
    }
  }
}
</style>