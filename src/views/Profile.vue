<template>
  <div class="profile-container">
    <!-- 页头导航 -->
    <van-nav-bar 
      title="个人中心" 
      left-arrow 
      @click-left="goBack"
      fixed
      placeholder
    />

    <!-- 用户信息卡片 -->
    <div class="user-card" @click="handleUserCardClick">
      <div class="user-info">
        <van-image
          round
          width="60"
          height="60"
          :src="userStore.isAuthenticated ? userStore.avatar || 'https://img01.yzcdn.cn/vant/cat.jpeg' : ''"
          class="avatar"
          :class="{ 'default-avatar': !userStore.isAuthenticated }"
        >
          <template #error>
            <van-icon name="user-o" size="30" color="#c8c9cc" />
          </template>
        </van-image>
        <div class="user-details">
          <div class="username">{{ userStore.isAuthenticated ? userStore.displayName : '点击登录' }}</div>
          <div class="user-meta" v-if="userStore.isAuthenticated">
            <van-rate :model-value="userStore.userStats.rating" readonly size="12" />
            <span class="credit-score">信用分：{{ userStore.userStats.creditScore }}</span>
          </div>
          <div class="login-tip" v-else>
            登录后查看完整功能
          </div>
        </div>
        <div class="user-actions">
          <van-icon name="arrow" class="arrow-icon" v-if="!userStore.isAuthenticated" />
          <van-button 
            v-else
            type="default" 
            size="small" 
            @click.stop="showLogoutConfirm"
            class="logout-btn"
          >
            退出
          </van-button>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="stats-section">
      <div class="section-title">数据统计</div>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number blue">{{ userStore.userStats.participations }}</div>
          <div class="stat-label">参赛次数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number cyan">{{ userStore.userStats.organized }}</div>
          <div class="stat-label">组织次数</div>
        </div>
        <div class="stat-item">
          <div class="stat-number green">{{ userStore.userStats.friends }}</div>
          <div class="stat-label">球友人数</div>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <div class="section-title">功能菜单</div>
      <div class="menu-grid">
        <!-- 左列 -->
        <div class="menu-column">
          <van-cell class="menu-item" is-link @click="goToMyOrders">
            <template #icon>
              <div class="menu-icon blue-bg">
                <van-icon name="orders-o" color="#fff" size="20" />
              </div>
            </template>
            <template #title>
              <span class="menu-title">我的订单</span>
            </template>
            <template #label>
              <span class="menu-desc">查看历史订单</span>
            </template>
          </van-cell>

          <van-cell class="menu-item" is-link @click="goToFavorites">
            <template #icon>
              <div class="menu-icon orange-bg">
                <van-icon name="star-o" color="#fff" size="20" />
              </div>
            </template>
            <template #title>
              <span class="menu-title">收藏场地</span>
            </template>
            <template #label>
              <span class="menu-desc">我的收藏场地</span>
            </template>
          </van-cell>

          <van-cell class="menu-item" is-link @click="goToFriends">
            <template #icon>
              <div class="menu-icon green-bg">
                <van-icon name="friends-o" color="#fff" size="20" />
              </div>
            </template>
            <template #title>
              <span class="menu-title">球友通讯录</span>
            </template>
            <template #label>
              <span class="menu-desc">我的球友联系人</span>
            </template>
          </van-cell>
        </div>

        <!-- 右列 -->
        <div class="menu-column">
          <van-cell class="menu-item" is-link @click="goToMyTeam">
            <template #icon>
              <div class="menu-icon cyan-bg">
                <van-icon name="friends-o" color="#fff" size="20" />
              </div>
            </template>
            <template #title>
              <span class="menu-title">我的队伍</span>
            </template>
            <template #label>
              <span class="menu-desc">查看我的队伍</span>
            </template>
          </van-cell>

          <van-cell class="menu-item" is-link @click="goToSports">
            <template #icon>
              <div class="menu-icon blue-light-bg">
                <van-icon name="medal-o" color="#fff" size="20" />
              </div>
            </template>
            <template #title>
              <span class="menu-title">运动数据</span>
            </template>
            <template #label>
              <span class="menu-desc">查看运动记录</span>
            </template>
          </van-cell>

          <van-cell class="menu-item" is-link @click="goToSettings">
            <template #icon>
              <div class="menu-icon gray-bg">
                <van-icon name="setting-o" color="#fff" size="20" />
              </div>
            </template>
            <template #title>
              <span class="menu-title">设置</span>
            </template>
            <template #label>
              <span class="menu-desc">账户设置中心</span>
            </template>
          </van-cell>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div class="bottom-action">
      <van-button type="primary" block round class="create-team-btn" @click="handleCreateTeam">
        <van-icon name="add-o" />
        创建我的球队
      </van-button>
    </div>

    <!-- 退出登录按钮 -->
    <div class="logout-section" v-if="userStore.isAuthenticated">
      <LogoutButton 
        :block="true" 
        :round="true" 
        text="退出登录"
        @logout="handleLogoutSuccess"
      />
    </div>

    <!-- 登录弹窗 -->
    <van-popup 
      v-model:show="showLoginDialog" 
      position="center" 
      round 
      :style="{ width: '85%', padding: '24px' }"
    >
      <div class="login-dialog">
        <div class="login-header">
          <h3>登录账户</h3>
          <p>登录后享受完整功能</p>
        </div>
        
        <van-form @submit="handleLogin" class="login-form">
          <van-field
            v-model="loginForm.phone"
            name="phone"
            label="手机号"
            placeholder="请输入11位手机号"
            :rules="phoneRules"
            type="tel"
            maxlength="11"
          />
          <van-field
            v-model="loginForm.password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="passwordRules"
            type="password"
          />
          
          <!-- 图形验证码 -->
          <div class="captcha-row">
            <van-field
              v-model="loginForm.captcha"
              name="captcha"
              label="验证码"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '请输入验证码' }]"
              class="captcha-input"
            />
            <div class="captcha-image" @click="refreshCaptcha">
              <canvas ref="captchaCanvas" width="100" height="40"></canvas>
            </div>
          </div>
          
          <div class="login-actions">
            <van-button 
              type="primary" 
              block 
              round 
              native-type="submit"
              :loading="userStore.loading.login"
            >
              登录
            </van-button>
            
            <div class="login-links">
              <span @click="switchToRegister">注册账户</span>
              <span @click="showForgotPassword">忘记密码</span>
            </div>
          </div>
        </van-form>
        
        <van-button 
          class="close-btn" 
          type="default" 
          size="small" 
          @click="showLoginDialog = false"
        >
          取消
        </van-button>
      </div>
    </van-popup>

    <!-- 注册弹窗 -->
    <van-popup 
      v-model:show="showRegisterDialog" 
      position="center" 
      round 
      :style="{ width: '85%', padding: '24px' }"
    >
      <div class="register-dialog">
        <div class="register-header">
          <h3>注册账户</h3>
          <p>创建新账户，享受完整功能</p>
        </div>
        
        <van-form @submit="handleRegister" class="register-form">
          <van-field
            v-model="registerForm.phone"
            name="phone"
            label="手机号"
            placeholder="请输入11位手机号"
            :rules="phoneRules"
            type="tel"
            maxlength="11"
          />
          
          <van-field
            v-model="registerForm.password"
            name="password"
            label="密码"
            placeholder="请输入6-20位密码"
            :rules="passwordRules"
            type="password"
          />
          
          <van-field
            v-model="registerForm.confirmPassword"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="confirmPasswordRules"
            type="password"
          />
          
          <!-- 短信验证码 -->
          <div class="sms-row">
            <van-field
              v-model="registerForm.smsCode"
              name="smsCode"
              label="验证码"
              placeholder="请输入短信验证码"
              :rules="[{ required: true, message: '请输入短信验证码' }]"
              class="sms-input"
            />
            <van-button 
              class="sms-btn"
              size="small"
              :disabled="!canSendSms || smsCountdown > 0"
              @click="sendSmsCode"
            >
              {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码' }}
            </van-button>
          </div>
          
          <!-- 用户协议 -->
          <van-checkbox v-model="registerForm.agreement" class="agreement-checkbox">
            我已阅读并同意
            <span class="agreement-link" @click="showAgreement">《用户协议》</span>
            和
            <span class="agreement-link" @click="showPrivacy">《隐私政策》</span>
          </van-checkbox>
          
          <div class="register-actions">
            <van-button 
              type="primary" 
              block 
              round 
              native-type="submit"
              :loading="userStore.loading.register"
              :disabled="!registerForm.agreement"
            >
              注册
            </van-button>
            
            <div class="register-links">
              <span @click="switchToLogin">已有账户？立即登录</span>
            </div>
          </div>
        </van-form>
        
        <van-button 
          class="close-btn" 
          type="default" 
          size="small" 
          @click="showRegisterDialog = false"
        >
          取消
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showDialog, showSuccessToast } from 'vant';
import { useUserStore } from '../stores/user.js';
import AuthManager from '../utils/auth.js';
import LoginHandler from '../utils/loginHandler.js';
import LogoutButton from '../components/LogoutButton.vue';

const router = useRouter();
const userStore = useUserStore();

// 弹窗状态
const showLoginDialog = ref(false);
const showRegisterDialog = ref(false);
const smsCountdown = ref(0);

// 登录表单数据
const loginForm = ref({
  phone: '',
  password: '',
  captcha: ''
});

// 注册表单数据
const registerForm = ref({
  phone: '',
  password: '',
  confirmPassword: '',
  smsCode: '',
  agreement: false
});

// 图形验证码
const captchaCode = ref('');
const captchaCanvas = ref(null);

// 表单验证规则
const phoneRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
];

const passwordRules = [
  { required: true, message: '请输入密码' },
  { min: 6, max: 20, message: '密码长度为6-20位' }
];

const confirmPasswordRules = [
  { required: true, message: '请再次输入密码' },
  {
    validator: (value) => {
      if (value !== registerForm.value.password) {
        return '两次输入的密码不一致';
      }
      return true;
    }
  }
];

// 计算属性
const canSendSms = computed(() => {
  return /^1[3-9]\d{9}$/.test(registerForm.value.phone);
});

const goBack = () => {
  router.back();
};

// 处理用户卡片点击
const handleUserCardClick = () => {
  if (!userStore.isAuthenticated) {
    showLoginDialog.value = true;
  }
};

// 检查登录状态的通用方法
const checkLoginAndExecute = (callback) => {
  if (!userStore.isAuthenticated) {
    showLoginDialog.value = true;
    return;
  }
  callback();
};

const goToMyOrders = () => {
  checkLoginAndExecute(() => {
    showToast('我的订单');
  });
};

const goToFavorites = () => {
  checkLoginAndExecute(() => {
    showToast('收藏场地');
  });
};

const goToFriends = () => {
  checkLoginAndExecute(() => {
    showToast('球友通讯录');
  });
};

const goToMyTeam = () => {
  checkLoginAndExecute(() => {
    showToast('我的队伍');
  });
};

const goToSports = () => {
  checkLoginAndExecute(() => {
    showToast('运动数据');
  });
};

const goToSettings = () => {
  // 跳转到设置页面
  router.push('/settings');
};

// 处理创建球队按钮点击
const handleCreateTeam = () => {
  checkLoginAndExecute(() => {
    showToast('创建我的球队');
  });
};

// 生成图形验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaCode.value = code;
  
  // 绘制验证码
  nextTick(() => {
    if (captchaCanvas.value) {
      const ctx = captchaCanvas.value.getContext('2d');
      const canvas = captchaCanvas.value;
      
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 设置背景
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制干扰线
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }
      
      // 绘制验证码文字
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      for (let i = 0; i < code.length; i++) {
        ctx.fillStyle = `hsl(${Math.random() * 360}, 70%, 40%)`;
        const x = (canvas.width / code.length) * (i + 0.5);
        const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
        const angle = (Math.random() - 0.5) * 0.3;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillText(code[i], 0, 0);
        ctx.restore();
      }
      
      // 绘制干扰点
      for (let i = 0; i < 20; i++) {
        ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
      }
    }
  });
};

// 刷新验证码
const refreshCaptcha = () => {
  generateCaptcha();
};

// 处理登录
const handleLogin = async (values) => {
  // 验证图形验证码
  if (values.captcha.toLowerCase() !== captchaCode.value.toLowerCase()) {
    showToast('验证码错误');
    refreshCaptcha();
    return;
  }
  
  try {
    await userStore.login({
      phone: values.phone,
      password: values.password,
      captcha: values.captcha
    });
    
    showLoginDialog.value = false;
    showToast('登录成功');
    
    // 清空表单
    loginForm.value = {
      phone: '',
      password: '',
      captcha: ''
    };
    
    // 刷新验证码
    refreshCaptcha();
    
    // 如果有重定向路径，登录成功后跳转
    if (redirectPath.value) {
      setTimeout(() => {
        router.push(redirectPath.value);
        redirectPath.value = ''; // 清空重定向路径
      }, 1000);
    }
    
    // 如果有特定功能，登录成功后执行
    if (loginFeature.value) {
      setTimeout(() => {
        handleLoginFeature(loginFeature.value);
        loginFeature.value = ''; // 清空功能标识
      }, 1000);
    }
    
    // 如果有操作ID，通知登录处理器执行回调
    if (actionId.value) {
      setTimeout(() => {
        LoginHandler.handleLoginSuccess(actionId.value);
        actionId.value = ''; // 清空操作ID
      }, 500);
    }
  } catch (error) {
    showToast(error.message || '登录失败，请重试');
    refreshCaptcha();
  }
};

// 处理注册
const handleRegister = async (values) => {
  try {
    await userStore.register({
      phone: values.phone,
      password: values.password,
      confirmPassword: values.confirmPassword,
      smsCode: values.smsCode
    });
    
    showRegisterDialog.value = false;
    showToast('注册成功');
    
    // 清空表单
    registerForm.value = {
      phone: '',
      password: '',
      confirmPassword: '',
      smsCode: '',
      agreement: false
    };
  } catch (error) {
    showToast(error.message || '注册失败，请重试');
  }
};

// 发送短信验证码
const sendSmsCode = async () => {
  if (!canSendSms.value) {
    showToast('请输入正确的手机号');
    return;
  }
  
  try {
    await userStore.sendSmsCode(registerForm.value.phone);
    showToast('验证码已发送');
    
    // 开始倒计时
    smsCountdown.value = 60;
    const timer = setInterval(() => {
      smsCountdown.value--;
      if (smsCountdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
  } catch (error) {
    showToast(error.message || '发送失败，请重试');
  }
};

// 切换到注册
const switchToRegister = () => {
  showLoginDialog.value = false;
  showRegisterDialog.value = true;
};

// 切换到登录
const switchToLogin = () => {
  showRegisterDialog.value = false;
  showLoginDialog.value = true;
};

// 显示忘记密码
const showForgotPassword = () => {
  showToast('忘记密码功能');
};

// 显示用户协议
const showAgreement = () => {
  showToast('用户协议');
};

// 显示隐私政策
const showPrivacy = () => {
  showToast('隐私政策');
};

// 显示退出登录确认
const showLogoutConfirm = () => {
  showDialog({
    title: '退出登录',
    message: '确定要退出当前账户吗？',
    showCancelButton: true,
    confirmButtonText: '确定退出',
    cancelButtonText: '取消',
    confirmButtonColor: '#ee0a24'
  }).then(() => {
    handleLogout();
  }).catch(() => {
    // 用户取消退出
  });
};

// 处理退出登录
const handleLogout = async () => {
  try {
    await userStore.logout();
    showSuccessToast('已退出登录');
    
    // 清空表单数据
    loginForm.value = {
      phone: '',
      password: '',
      captcha: ''
    };
    
    registerForm.value = {
      phone: '',
      password: '',
      confirmPassword: '',
      smsCode: '',
      agreement: false
    };
    
    // 刷新验证码
    refreshCaptcha();
  } catch (error) {
    showToast('退出登录失败，请重试');
  }
};

// 处理退出登录成功
const handleLogoutSuccess = () => {
  showSuccessToast('已退出登录');
  
  // 清空表单数据
  loginForm.value = {
    phone: '',
    password: '',
    captcha: ''
  };
  
  registerForm.value = {
    phone: '',
    password: '',
    confirmPassword: '',
    smsCode: '',
    agreement: false
  };
  
  // 刷新验证码
  refreshCaptcha();
};

// 保存重定向路径、功能信息和操作ID
const redirectPath = ref('');
const loginFeature = ref('');
const actionId = ref('');

// 处理登录成功后的功能执行
const handleLoginFeature = (feature) => {
  switch (feature) {
    case 'view-profile':
      showToast('查看个人资料');
      break;
    case 'join-activity':
      showToast('加入活动成功');
      break;
    case 'view-venue':
      showToast('查看场地详情');
      break;
    case 'book-venue':
      showToast('预订场地');
      break;
    case 'view-friends':
      showToast('查看好友列表');
      break;
    case 'add-friend':
      showToast('添加好友');
      break;
    case 'favorite-venue':
      showToast('收藏场地成功');
      break;
    case 'create-team':
      showToast('创建球队');
      break;
    default:
      // 未知功能
      break;
  }
};



// 组件挂载时初始化
onMounted(async () => {
  generateCaptcha();
  
  // 如果用户已登录但统计数据为空，则获取统计数据
  if (userStore.isAuthenticated && userStore.userStats.participations === 0) {
    await userStore.fetchUserStats();
  }
});
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 20px;
}



.user-card {
  margin: 12px 16px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    
    .avatar {
      flex-shrink: 0;
      
      &.default-avatar {
        background: #f7f8fa;
        border: 2px dashed #c8c9cc;
      }
    }
    
    .user-details {
      flex: 1;
      
      .username {
        font-size: 18px;
        font-weight: 600;
        color: #323233;
        margin-bottom: 8px;
      }
      
      .user-meta {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .credit-score {
          font-size: 14px;
          color: #646566;
        }
      }
      
      .login-tip {
        font-size: 14px;
        color: #969799;
      }
    }
    
    .user-actions {
      display: flex;
      align-items: center;
      
      .arrow-icon {
        color: #c8c9cc;
        font-size: 16px;
      }
      
      .logout-btn {
        height: 32px;
        padding: 0 12px;
        font-size: 12px;
        border-color: #ee0a24;
        color: #ee0a24;
        
        &:hover {
          background: #fee;
        }
        
        &:active {
          transform: scale(0.95);
        }
      }
    }
  }
}

.stats-section, .menu-section {
  margin: 12px 16px;
  
  .section-title {
    font-size: 16px;
    font-weight: 500;
    color: #323233;
    margin-bottom: 12px;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  
  .stat-item {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    
    .stat-number {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 8px;
      
      &.blue { color: #1989fa; }
      &.cyan { color: #00d4aa; }
      &.green { color: #07c160; }
    }
    
    .stat-label {
      font-size: 14px;
      color: #646566;
    }
  }
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  
  .menu-column {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.menu-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  
  :deep(.van-cell__left-icon) {
    margin-right: 12px;
  }
  
  .menu-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &.blue-bg { background: #1989fa; }
    &.orange-bg { background: #ff976a; }
    &.green-bg { background: #07c160; }
    &.cyan-bg { background: #00d4aa; }
    &.blue-light-bg { background: #4fc3f7; }
    &.gray-bg { background: #969799; }
  }
  
  .menu-title {
    font-size: 15px;
    font-weight: 500;
    color: #323233;
  }
  
  .menu-desc {
    font-size: 12px;
    color: #969799;
    margin-top: 2px;
  }
}

.bottom-action {
  margin: 24px 16px;
  
  .create-team-btn {
    height: 48px;
    font-size: 16px;
    font-weight: 500;
    
    .van-icon {
      margin-right: 8px;
    }
  }
}

.logout-section {
  margin: 16px 16px 24px;
  
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

// 登录弹窗样式
.login-dialog, .register-dialog {
  .login-header, .register-header {
    text-align: center;
    margin-bottom: 24px;
    
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #323233;
      margin: 0 0 8px 0;
    }
    
    p {
      font-size: 14px;
      color: #969799;
      margin: 0;
    }
  }
  
  .login-form, .register-form {
    margin-bottom: 16px;
    
    .van-field {
      margin-bottom: 16px;
    }
    
    // 图形验证码行
    .captcha-row {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      margin-bottom: 16px;
      
      .captcha-input {
        flex: 1;
      }
      
      .captcha-image {
        width: 100px;
        height: 40px;
        border: 1px solid #ebedf0;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        
        canvas {
          border-radius: 4px;
        }
        
        &:hover {
          border-color: #1989fa;
        }
      }
    }
    
    // 短信验证码行
    .sms-row {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      margin-bottom: 16px;
      
      .sms-input {
        flex: 1;
      }
      
      .sms-btn {
        height: 40px;
        padding: 0 12px;
        font-size: 12px;
        white-space: nowrap;
        
        &:disabled {
          background: #f7f8fa;
          color: #c8c9cc;
          border-color: #ebedf0;
        }
      }
    }
    
    // 用户协议复选框
    .agreement-checkbox {
      margin: 16px 0;
      font-size: 14px;
      color: #646566;
      
      .agreement-link {
        color: #1989fa;
        cursor: pointer;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
    
    .login-actions, .register-actions {
      margin-top: 24px;
      
      .van-button {
        height: 44px;
        font-size: 16px;
        margin-bottom: 16px;
      }
      
      .login-links, .register-links {
        display: flex;
        justify-content: center;
        
        span {
          font-size: 14px;
          color: #1989fa;
          cursor: pointer;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
      
      .login-links {
        justify-content: space-between;
      }
    }
  }
  
  .close-btn {
    width: 100%;
    margin-top: 8px;
  }
}
</style>