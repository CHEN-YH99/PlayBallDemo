<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 表单数据
const loginForm = ref({
  phone: '',
  password: '',
  rememberMe: false
})

// 页面状态
const loading = ref(false)
const loginType = ref('password') // password | sms

// 短信验证码相关
const smsCode = ref('')
const smsCountdown = ref(0)
const smsTimer = ref(null)

// 表单验证规则
const phonePattern = /^1[3-9]\d{9}$/
const passwordPattern = /^.{6,20}$/

// 计算属性
const canLogin = computed(() => {
  if (loginType.value === 'password') {
    return phonePattern.test(loginForm.value.phone) && 
           passwordPattern.test(loginForm.value.password)
  } else {
    return phonePattern.test(loginForm.value.phone) && 
           smsCode.value.length === 6
  }
})

// 发送短信验证码
const sendSmsCode = async () => {
  if (!phonePattern.test(loginForm.value.phone)) {
    showToast('请输入正确的手机号')
    return
  }
  
  try {
    // 模拟发送短信
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToast('验证码已发送')
    
    // 开始倒计时
    smsCountdown.value = 60
    smsTimer.value = setInterval(() => {
      smsCountdown.value--
      if (smsCountdown.value <= 0) {
        clearInterval(smsTimer.value)
        smsTimer.value = null
      }
    }, 1000)
  } catch (error) {
    showToast('发送验证码失败')
  }
}

// 登录处理
const handleLogin = async () => {
  if (!canLogin.value) {
    showToast('请完善登录信息')
    return
  }
  
  loading.value = true
  try {
    let loginData
    if (loginType.value === 'password') {
      loginData = {
        phone: loginForm.value.phone,
        password: loginForm.value.password
      }
    } else {
      loginData = {
        phone: loginForm.value.phone,
        smsCode: smsCode.value
      }
    }
    
    // 调用登录方法
    await userStore.login(loginData)
    showToast('登录成功')
    
    // 跳转到重定向页面或首页
    const redirectPath = route.query.redirect || '/'
    router.replace(redirectPath)
  } catch (error) {
    showToast(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}

// 切换登录方式
const switchLoginType = () => {
  loginType.value = loginType.value === 'password' ? 'sms' : 'password'
  // 清空相关数据
  loginForm.value.password = ''
  smsCode.value = ''
}

// 快速登录（演示用）
const quickLogin = async () => {
  loading.value = true
  try {
    await userStore.login({
      phone: '13800138000',
      password: 'demo123456'
    })
    showToast('登录成功')
    const redirectPath = route.query.redirect || '/'
    router.replace(redirectPath)
  } catch (error) {
    showToast('快速登录失败')
  } finally {
    loading.value = false
  }
}

// 页面销毁时清理定时器
onUnmounted(() => {
  if (smsTimer.value) {
    clearInterval(smsTimer.value)
  }
})

// 页面初始化
onMounted(() => {
  // 如果已经登录，直接跳转
  if (userStore.isAuthenticated) {
    const redirectPath = route.query.redirect || '/'
    router.replace(redirectPath)
  }
})
</script>

<template>
  <div class="login-view">
    <!-- 头部 -->
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="router.back()"
    />
    
    <!-- 登录表单 -->
    <div class="login-container">
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo">🏃</div>
        <h1 class="app-name">PlayBall</h1>
        <p class="app-slogan">让运动更有趣</p>
      </div>
      
      <!-- 表单区域 -->
      <van-form @submit="handleLogin">
        <!-- 手机号 -->
        <van-field
          v-model="loginForm.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          :rules="[{ pattern: phonePattern, message: '请输入正确的手机号' }]"
          maxlength="11"
          type="tel"
        />
        
        <!-- 密码登录 -->
        <template v-if="loginType === 'password'">
          <van-field
            v-model="loginForm.password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            type="password"
            :rules="[{ pattern: passwordPattern, message: '密码长度为6-20位' }]"
          />
        </template>
        
        <!-- 短信登录 -->
        <template v-else>
          <van-field
            v-model="smsCode"
            name="smsCode"
            label="验证码"
            placeholder="请输入验证码"
            maxlength="6"
            type="number"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                plain
                :disabled="smsCountdown > 0 || !phonePattern.test(loginForm.phone)"
                @click="sendSmsCode"
              >
                {{ smsCountdown > 0 ? `${smsCountdown}s` : '发送验证码' }}
              </van-button>
            </template>
          </van-field>
        </template>
        
        <!-- 记住我 -->
        <van-field name="rememberMe">
          <template #input>
            <van-checkbox v-model="loginForm.rememberMe">
              记住我
            </van-checkbox>
          </template>
        </van-field>
        
        <!-- 登录按钮 -->
        <div class="login-actions">
          <van-button
            type="primary"
            size="large"
            block
            :loading="loading"
            :disabled="!canLogin"
            native-type="submit"
          >
            {{ loading ? '登录中...' : '登录' }}
          </van-button>
        </div>
      </van-form>
      
      <!-- 切换登录方式 -->
      <div class="switch-login">
        <van-button
          type="default"
          plain
          size="small"
          @click="switchLoginType"
        >
          {{ loginType === 'password' ? '短信验证码登录' : '密码登录' }}
        </van-button>
      </div>
      
      <!-- 快速登录（演示） -->
      <div class="quick-login">
        <van-divider>演示功能</van-divider>
        <van-button
          type="warning"
          plain
          size="small"
          block
          @click="quickLogin"
        >
          快速登录 (演示账号)
        </van-button>
      </div>
      
      <!-- 其他操作 -->
      <div class="other-actions">
        <van-button type="default" plain size="small">
          忘记密码？
        </van-button>
        <van-button type="default" plain size="small">
          注册账号
        </van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  padding: 40px 20px 20px;
  
  .logo-section {
    text-align: center;
    margin-bottom: 40px;
    
    .logo {
      font-size: 60px;
      margin-bottom: 16px;
    }
    
    .app-name {
      font-size: 32px;
      font-weight: bold;
      color: #fff;
      margin: 0 0 8px 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    
    .app-slogan {
      font-size: 16px;
      color: rgba(255,255,255,0.8);
      margin: 0;
    }
  }
  
  .van-form {
    background: #fff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  }
  
  .login-actions {
    margin-top: 24px;
  }
  
  .switch-login {
    text-align: center;
    margin: 16px 0;
  }
  
  .quick-login {
    margin: 20px 0;
    
    .van-divider {
      color: rgba(255,255,255,0.7);
      border-color: rgba(255,255,255,0.3);
    }
  }
  
  .other-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    
    .van-button {
      color: rgba(255,255,255,0.8);
      border-color: rgba(255,255,255,0.3);
    }
  }
}
</style>