<template>
  <div class="settings-container">
    <!-- 页头导航 -->
    <PageHeader title="设置" @back="goBack" />

    <div class="settings-content">
      <!-- 账户设置 -->
      <div class="settings-section">
        <div class="section-title">账户设置</div>
        <van-cell-group>
          <van-cell title="修改密码" is-link @click="goToChangePassword" />
          <van-cell title="绑定手机" is-link @click="goToBindPhone" />
          <van-cell title="实名认证" is-link @click="goToRealNameAuth" />
          <van-cell title="账户安全" is-link @click="goToAccountSecurity" />
        </van-cell-group>
      </div>

      <!-- 通知设置 -->
      <div class="settings-section">
        <div class="section-title">通知设置</div>
        <van-cell-group>
          <van-cell title="消息通知">
            <template #right-icon>
              <van-switch v-model="notificationSettings.message" size="20" />
            </template>
          </van-cell>
          <van-cell title="活动提醒">
            <template #right-icon>
              <van-switch v-model="notificationSettings.activity" size="20" />
            </template>
          </van-cell>
          <van-cell title="系统通知">
            <template #right-icon>
              <van-switch v-model="notificationSettings.system" size="20" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 隐私设置 -->
      <div class="settings-section">
        <div class="section-title">隐私设置</div>
        <van-cell-group>
          <van-cell title="个人资料可见性" is-link @click="goToPrivacySettings" />
          <van-cell title="运动数据隐私" is-link @click="goToDataPrivacy" />
          <van-cell title="位置信息" is-link @click="goToLocationSettings" />
        </van-cell-group>
      </div>

      <!-- 通用设置 -->
      <div class="settings-section">
        <div class="section-title">通用设置</div>
        <van-cell-group>
          <van-cell title="语言设置" :value="currentLanguage" is-link @click="goToLanguageSettings" />
          <van-cell title="清除缓存" :value="cacheSize" is-link @click="clearCache" />
          <van-cell title="检查更新" is-link @click="checkUpdate" />
        </van-cell-group>
      </div>

      <!-- 帮助与反馈 -->
      <div class="settings-section">
        <div class="section-title">帮助与反馈</div>
        <van-cell-group>
          <van-cell title="使用帮助" is-link @click="goToHelp" />
          <van-cell title="意见反馈" is-link @click="goToFeedback" />
          <van-cell title="联系客服" is-link @click="contactService" />
          <van-cell title="关于我们" is-link @click="goToAbout" />
        </van-cell-group>
      </div>

      <!-- 退出登录按钮 -->
      <div class="logout-section" v-if="userStore.isAuthenticated">
        <LogoutButton :block="true" :round="true" text="退出登录" @logout="handleLogoutSuccess"
          @before-logout="handleBeforeLogout" @after-logout="handleAfterLogout" />
      </div>

      <!-- 未登录提示 -->
      <div class="login-prompt" v-else>
        <van-empty image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="请先登录以使用完整功能">
          <van-button type="primary" round @click="goToLogin" class="login-btn">
            立即登录
          </van-button>
        </van-empty>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.js';
import { showToast, showSuccessToast, showLoadingToast, showDialog } from 'vant';
import LogoutButton from '../components/LogoutButton.vue';
import PageHeader from '../components/PageHeader.vue';

const router = useRouter();
const userStore = useUserStore();

// 通知设置
const notificationSettings = ref({
  message: true,
  activity: true,
  system: false
});

// 其他设置
const currentLanguage = ref('中文');
const cacheSize = ref('12.5MB');

const goBack = () => {
  // 设置页面应该始终返回到"我的"页面
  router.push('/user');
};

// 检查登录状态的通用方法
const checkLoginAndExecute = (callback, featureName) => {
  if (!userStore.isAuthenticated) {
    showDialog({
      title: '需要登录',
      message: `${featureName}需要登录后才能使用，是否立即登录？`,
      showCancelButton: true,
      confirmButtonText: '立即登录',
      cancelButtonText: '取消',
      confirmButtonColor: '#1989fa'
    }).then(() => {
      goToLogin();
    });
    return;
  }
  callback();
};

// 账户设置相关
const goToChangePassword = () => {
  checkLoginAndExecute(() => {
    showToast('修改密码功能');
  }, '修改密码');
};

const goToBindPhone = () => {
  checkLoginAndExecute(() => {
    showToast('绑定手机功能');
  }, '绑定手机');
};

const goToRealNameAuth = () => {
  checkLoginAndExecute(() => {
    showToast('实名认证功能');
  }, '实名认证');
};

const goToAccountSecurity = () => {
  checkLoginAndExecute(() => {
    showToast('账户安全功能');
  }, '账户安全');
};

// 隐私设置相关
const goToPrivacySettings = () => {
  showToast('隐私设置功能');
};

const goToDataPrivacy = () => {
  showToast('数据隐私功能');
};

const goToLocationSettings = () => {
  showToast('位置设置功能');
};

// 通用设置相关
const goToLanguageSettings = () => {
  showToast('语言设置功能');
};

const clearCache = () => {
  showDialog({
    title: '清除缓存',
    message: '确定要清除所有缓存数据吗？',
    showCancelButton: true,
    confirmButtonText: '确定清除',
    cancelButtonText: '取消'
  }).then(() => {
    const toast = showLoadingToast({
      message: '清除中...',
      forbidClick: true,
      duration: 2000
    });

    setTimeout(() => {
      toast.close();
      showSuccessToast('缓存清除成功');
      cacheSize.value = '0MB';
    }, 2000);
  });
};

const checkUpdate = () => {
  const toast = showLoadingToast({
    message: '检查更新中...',
    forbidClick: true,
    duration: 2000
  });

  setTimeout(() => {
    toast.close();
    showToast('当前已是最新版本');
  }, 2000);
};

// 帮助与反馈相关
const goToHelp = () => {
  showToast('使用帮助功能');
};

const goToFeedback = () => {
  showToast('意见反馈功能');
};

const contactService = () => {
  showDialog({
    title: '联系客服',
    message: '客服电话：400-123-4567\n工作时间：9:00-18:00',
    confirmButtonText: '拨打电话',
    cancelButtonText: '取消',
    showCancelButton: true
  }).then(() => {
    showToast('拨打客服电话');
  });
};

const goToAbout = () => {
  showDialog({
    title: '关于我们',
    message: 'PlayBall v1.0.0\n一个专业的运动社交平台\n让运动更有趣，让社交更简单',
    confirmButtonText: '确定'
  });
};

// 登录相关
const goToLogin = () => {
  // 触发全局登录弹窗事件
  const event = new CustomEvent('show-login-dialog', {
    detail: {
      source: 'settings-page',
      redirectPath: '/settings'
    }
  });
  window.dispatchEvent(event);
};

// 退出登录相关
const handleBeforeLogout = () => {
  // 准备退出登录
};

const handleAfterLogout = () => {
  // 退出登录完成，跳转到首页
  router.push('/');
};

const handleLogoutSuccess = () => {
  showSuccessToast('已退出登录');
  // 可以在这里做一些额外的清理工作
};

onMounted(() => {
  // 初始化设置数据
});
</script>

<style lang="scss" scoped>
.settings-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}

.settings-content {
  padding-top: 46px;
}

.settings-section {
  margin-bottom: 12px;

  .section-title {
    padding: 16px 16px 12px;
    font-size: 14px;
    font-weight: 500;
    color: #969799;
    background: transparent;
  }
}

.logout-section {
  margin: 32px 16px 24px;

  :deep(.van-button) {
    height: 44px;
    font-size: 15px;
    background: #fff;
    border: 1px solid #ee0a24;
    color: #ee0a24;

    &:hover {
      background: #fef0f0;
    }

    &:active {
      transform: scale(0.98);
    }

    .van-icon {
      margin-right: 6px;
    }
  }
}

:deep(.van-cell-group) {
  margin: 0 16px;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.van-cell) {
  padding: 16px;

  &:not(:last-child)::after {
    left: 16px;
    right: 16px;
  }
}

:deep(.van-switch) {
  &.van-switch--on {
    background-color: #1989fa;
  }
}

.login-prompt {
  margin: 40px 16px;
  padding: 40px 20px;
  background: #fff;
  border-radius: 12px;
  text-align: center;

  .login-btn {
    margin-top: 16px;
    width: 120px;
  }
}
</style>