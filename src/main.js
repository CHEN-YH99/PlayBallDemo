import { createApp } from 'vue'
import App from './App.vue'
import 'vant/lib/index.css'
import Vant from 'vant';
import { createPinia } from 'pinia'
import router from './router/index.js'
import { useUserStore } from './stores/user.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 注册Vant组件
app.use(Vant)

// 应用启动后初始化用户状态
app.mount('#app')

// 初始化用户状态
const initApp = async () => {
  const userStore = useUserStore();
  await userStore.restoreLoginState();
  
  // 监听全局退出登录事件
  window.addEventListener('user-logout', () => {
    // 用户已退出登录，可以在这里执行一些全局的清理工作
  });
  
  // 监听强制退出登录事件
  window.addEventListener('force-logout', (event) => {
    // 强制退出登录，可以在这里显示强制退出的提示
  });
};

// 等待应用挂载后初始化
setTimeout(initApp, 100);
