import { defineStore } from 'pinia';
import ApiService from '../services/api.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    // 用户信息
    currentUser: null,
    isLoggedIn: false,
    token: null,

    // 用户统计数据
    userStats: {
      participations: 0,
      organized: 0,
      friends: 0,
      rating: 5.0,
      creditScore: 100
    },

    // 加载状态
    loading: {
      login: false,
      register: false,
      stats: false,
      logout: false
    }
  }),

  getters: {
    // 获取用户显示名称
    displayName: (state) => {
      return state.currentUser?.nickname || state.currentUser?.phone || '未登录';
    },

    // 获取用户头像
    avatar: (state) => {
      return state.currentUser?.avatar || '';
    },

    // 检查是否已登录
    isAuthenticated: (state) => {
      return state.isLoggedIn && state.currentUser && state.token;
    }
  },

  actions: {
    // 登录
    async login(loginData) {
      this.loading.login = true;

      try {
        const response = await ApiService.login(
          loginData.phone,
          loginData.password,
          loginData.captcha
        );

        if (response.success) {
          this.currentUser = response.data;
          this.isLoggedIn = true;
          this.token = response.token;

          // 保存到本地存储
          localStorage.setItem('user_token', response.token);
          localStorage.setItem('user_info', JSON.stringify(response.data));

          // 获取用户统计数据
          await this.fetchUserStats();

          return response;
        }
      } catch (error) {
        throw error;
      } finally {
        this.loading.login = false;
      }
    },

    // 注册
    async register(registerData) {
      this.loading.register = true;

      try {
        const response = await ApiService.register({
          phone: registerData.phone,
          password: registerData.password,
          nickname: registerData.phone, // 默认使用手机号作为昵称
        });

        if (response.success) {
          this.currentUser = response.data;
          this.isLoggedIn = true;
          this.token = response.token;

          // 保存到本地存储
          localStorage.setItem('user_token', response.token);
          localStorage.setItem('user_info', JSON.stringify(response.data));

          // 获取用户统计数据
          await this.fetchUserStats();

          return response;
        }
      } catch (error) {
        throw error;
      } finally {
        this.loading.register = false;
      }
    },

    // 登出
    async logout() {
      this.loading.logout = true;
      
      try {
        // 如果有token，调用后端退出登录接口
        if (this.token) {
          try {
            await ApiService.logout(this.token);
          } catch (error) {
            // 调用后端退出登录接口失败
            // 即使后端接口失败，也要继续清除本地状态
          }
        }
        
        // 清除用户状态
        this.currentUser = null;
        this.isLoggedIn = false;
        this.token = null;
        this.userStats = {
          participations: 0,
          organized: 0,
          friends: 0,
          rating: 5.0,
          creditScore: 100
        };
        
        // 清除本地存储
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_info');
        
        // 清除其他相关缓存
        this.clearUserCache();
        
        // 触发全局退出登录事件
        const event = new CustomEvent('user-logout');
        window.dispatchEvent(event);
        
        return Promise.resolve();
      } catch (error) {
        // 退出登录失败
        return Promise.reject(error);
      } finally {
        this.loading.logout = false;
      }
    },

    // 清除用户相关缓存
    clearUserCache() {
      try {
        // 清除用户相关的缓存数据
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('user_') || key.startsWith('cache_'))) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
        });
      } catch (error) {
        // 清除用户缓存失败
      }
    },

    // 强制退出登录（用于token过期等情况）
    forceLogout(reason = '登录已过期') {
      this.logout();
      
      // 可以在这里触发全局事件，通知其他组件
      const event = new CustomEvent('force-logout', {
        detail: { reason }
      });
      window.dispatchEvent(event);
      
      return Promise.resolve();
    },

    // 从本地存储恢复登录状态
    async restoreLoginState() {
      const token = localStorage.getItem('user_token');
      const userInfo = localStorage.getItem('user_info');

      if (token && userInfo) {
        try {
          this.token = token;
          this.currentUser = JSON.parse(userInfo);
          this.isLoggedIn = true;

          // 获取最新的用户统计数据
          await this.fetchUserStats();
        } catch (error) {
          // 恢复登录状态失败
          this.logout();
        }
      }
    },

    // 获取用户统计数据
    async fetchUserStats() {
      if (!this.currentUser) return;

      this.loading.stats = true;

      try {
        const response = await ApiService.getUserStats(this.currentUser.id);
        if (response.success) {
          this.userStats = response.data;
        }
      } catch (error) {
        // 获取用户统计数据失败
      } finally {
        this.loading.stats = false;
      }
    },

    // 更新用户统计数据
    async updateUserStats(stats) {
      if (!this.currentUser) return;

      try {
        const response = await ApiService.updateUserStats(this.currentUser.id, stats);
        if (response.success) {
          this.userStats = { ...this.userStats, ...stats };
        }
        return response;
      } catch (error) {
        // 更新用户统计数据失败
        throw error;
      }
    },

    // 发送短信验证码
    async sendSmsCode(phone) {
      try {
        const response = await ApiService.sendSmsCode(phone);
        return response;
      } catch (error) {
        throw error;
      }
    }
  }
});