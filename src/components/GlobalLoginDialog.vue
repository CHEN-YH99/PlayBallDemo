<template>
  <div>
    <!-- 登录弹窗 -->
    <van-popup 
      v-model:show="showLoginDialog" 
      position="center" 
      round 
      :style="{ width: '90%', maxWidth: '400px' }"
    >
      <div class="login-popup">
        <div class="popup-header">
          <h3>登录</h3>
          <van-icon name="cross" @click="showLoginDialog = false" />
        </div>
        
        <van-form @submit="handleLogin">
          <van-cell-group inset>
            <van-field
              v-model="loginForm.phone"
              name="phone"
              label="手机号"
              placeholder="请输入手机号"
              :rules="[{ required: true, message: '请输入手机号' }]"
            />
            <van-field
              v-model="loginForm.password"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请输入密码' }]"
            />
            <van-field
              v-model="loginForm.captcha"
              name="captcha"
              label="验证码"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '请输入验证码' }]"
            >
              <template #button>
                <img 
                  :src="captchaImage" 
                  @click="generateCaptcha"
                  style="height: 32px; cursor: pointer; border: 1px solid #ddd; border-radius: 4px;"
                  alt="验证码"
                />
              </template>
            </van-field>
          </van-cell-group>
          
          <div class="login-actions">
            <van-button 
              round 
              block 
              type="primary" 
              native-type="submit"
              :loading="userStore.loading.login"
            >
              登录
            </van-button>
            
            <div class="switch-actions">
              <van-button 
                type="default" 
                size="small" 
                @click="switchToRegister"
              >
                注册账号
              </van-button>
              <van-button 
                type="default" 
                size="small" 
                @click="showLoginDialog = false"
              >
                取消
              </van-button>
            </div>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 注册弹窗 -->
    <van-popup 
      v-model:show="showRegisterDialog" 
      position="center" 
      round 
      :style="{ width: '90%', maxWidth: '400px' }"
    >
      <div class="register-popup">
        <div class="popup-header">
          <h3>注册</h3>
          <van-icon name="cross" @click="showRegisterDialog = false" />
        </div>
        
        <van-form @submit="handleRegister">
          <van-cell-group inset>
            <van-field
              v-model="registerForm.phone"
              name="phone"
              label="手机号"
              placeholder="请输入手机号"
              :rules="[{ required: true, message: '请输入手机号' }]"
            />
            <van-field
              v-model="registerForm.smsCode"
              name="smsCode"
              label="验证码"
              placeholder="请输入短信验证码"
              :rules="[{ required: true, message: '请输入验证码' }]"
            >
              <template #button>
                <van-button 
                  size="small" 
                  type="primary" 
                  @click="sendSmsCode"
                  :disabled="smsCountdown > 0"
                >
                  {{ smsCountdown > 0 ? `${smsCountdown}s` : '获取验证码' }}
                </van-button>
              </template>
            </van-field>
            <van-field
              v-model="registerForm.password"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[{ required: true, message: '请输入密码' }]"
            />
            <van-field
              v-model="registerForm.confirmPassword"
              type="password"
              name="confirmPassword"
              label="确认密码"
              placeholder="请再次输入密码"
              :rules="[{ required: true, message: '请确认密码' }]"
            />
          </van-cell-group>
          
          <div class="register-actions">
            <van-button 
              round 
              block 
              type="primary" 
              native-type="submit"
              :loading="userStore.loading.register"
            >
              注册
            </van-button>
            
            <div class="switch-actions">
              <van-button 
                type="default" 
                size="small" 
                @click="switchToLogin"
              >
                已有账号
              </van-button>
              <van-button 
                type="default" 
                size="small" 
                @click="showRegisterDialog = false"
              >
                取消
              </van-button>
            </div>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/user.js';
import { showToast, showSuccessToast } from 'vant';

const router = useRouter();
const userStore = useUserStore();

// 弹窗状态
const showLoginDialog = ref(false);
const showRegisterDialog = ref(false);
const smsCountdown = ref(0);
const redirectPath = ref('');

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
  smsCode: ''
});

// 验证码相关
const captchaCode = ref('');
const captchaImage = ref('');

// 生成验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  captchaCode.value = result;
  
  // 生成验证码图片
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 40;
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#f0f0f0';
  ctx.fillRect(0, 0, 100, 40);
  ctx.fillStyle = '#333';
  ctx.font = '20px Arial';
  ctx.fillText(result, 20, 25);
  
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(Math.random() * 100, Math.random() * 40);
    ctx.lineTo(Math.random() * 100, Math.random() * 40);
    ctx.stroke();
  }
  
  captchaImage.value = canvas.toDataURL();
};

// 处理登录
const handleLogin = async () => {
  try {
    if (loginForm.value.captcha.toUpperCase() !== captchaCode.value) {
      showToast('验证码错误');
      generateCaptcha();
      loginForm.value.captcha = '';
      return;
    }

    await userStore.login(loginForm.value);
    
    showLoginDialog.value = false;
    showSuccessToast('登录成功');
    
    loginForm.value = { phone: '', password: '', captcha: '' };
    
    if (redirectPath.value) {
      router.push(redirectPath.value);
      redirectPath.value = '';
    }
    
  } catch (error) {
    showToast(error.message || '登录失败，请重试');
    generateCaptcha();
    loginForm.value.captcha = '';
  }
};

// 发送短信验证码
const sendSmsCode = async () => {
  if (!registerForm.value.phone || !/^1[3-9]\d{9}$/.test(registerForm.value.phone)) {
    showToast('请输入正确的手机号');
    return;
  }

  try {
    await userStore.sendSmsCode(registerForm.value.phone);
    showSuccessToast('验证码已发送');
    
    smsCountdown.value = 60;
    const timer = setInterval(() => {
      smsCountdown.value--;
      if (smsCountdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
    
  } catch (error) {
    showToast(error.message || '发送验证码失败，请重试');
  }
};

// 处理注册
const handleRegister = async () => {
  try {
    if (registerForm.value.password !== registerForm.value.confirmPassword) {
      showToast('两次输入的密码不一致');
      return;
    }

    await userStore.register(registerForm.value);
    
    showRegisterDialog.value = false;
    showSuccessToast('注册成功');
    
    registerForm.value = { phone: '', password: '', confirmPassword: '', smsCode: '' };
    
    if (redirectPath.value) {
      router.push(redirectPath.value);
      redirectPath.value = '';
    }
    
  } catch (error) {
    showToast(error.message || '注册失败，请重试');
  }
};

// 切换弹窗
const switchToRegister = () => {
  showLoginDialog.value = false;
  showRegisterDialog.value = true;
};

const switchToLogin = () => {
  showRegisterDialog.value = false;
  showLoginDialog.value = true;
};

// 全局登录事件监听
const handleGlobalLoginEvent = (event) => {
  showLoginDialog.value = true;
  
  if (event.detail?.redirectPath) {
    redirectPath.value = event.detail.redirectPath;
  }
};

onMounted(() => {
  generateCaptcha();
  window.addEventListener('show-login-dialog', handleGlobalLoginEvent);
});

onUnmounted(() => {
  window.removeEventListener('show-login-dialog', handleGlobalLoginEvent);
});
</script>

<style lang="scss" scoped>
.login-popup, .register-popup {
  padding: 20px;
  
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #323233;
    }
    
    .van-icon {
      font-size: 18px;
      color: #969799;
      cursor: pointer;
      
      &:hover {
        color: #323233;
      }
    }
  }
  
  .login-actions, .register-actions {
    margin-top: 20px;
    
    .van-button {
      margin-bottom: 12px;
    }
    
    .switch-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      
      .van-button {
        margin-bottom: 0;
        flex: 1;
        margin: 0 4px;
        
        &:first-child {
          margin-left: 0;
        }
        
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>