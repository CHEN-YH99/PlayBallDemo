import { useUserStore } from '../stores/user.js';
import { showSuccessToast, showToast } from 'vant';

// 全局退出登录处理器
class LogoutHandler {
  constructor() {
    this.userStore = null;
    this.callbacks = [];
  }

  // 初始化
  init() {
    if (!this.userStore) {
      this.userStore = useUserStore();
    }
    return this.userStore;
  }

  // 添加退出登录回调
  addCallback(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  // 移除退出登录回调
  removeCallback(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  // 执行退出登录
  async logout(options = {}) {
    this.init();
    
    const {
      showToast: showToastOption = true,
      clearCache = true,
      redirectTo = null,
      silent = false
    } = options;

    try {
      // 执行退出前回调
      this.callbacks.forEach(callback => {
        try {
          callback('before-logout');
        } catch (error) {
          console.error('退出登录前回调执行失败:', error);
        }
      });

      // 执行退出登录
      await this.userStore.logout();

      // 清除额外缓存
      if (clearCache) {
        this.clearExtraCache();
      }

      // 显示成功提示
      if (showToastOption && !silent) {
        showSuccessToast('已退出登录');
      }

      // 执行退出后回调
      this.callbacks.forEach(callback => {
        try {
          callback('after-logout');
        } catch (error) {
          console.error('退出登录后回调执行失败:', error);
        }
      });

      // 页面跳转
      if (redirectTo) {
        setTimeout(() => {
          if (typeof redirectTo === 'function') {
            redirectTo();
          } else if (typeof redirectTo === 'string') {
            window.location.href = redirectTo;
          }
        }, 1000);
      }

      return Promise.resolve();
    } catch (error) {
      console.error('退出登录失败:', error);
      if (!silent) {
        showToast('退出登录失败，请重试');
      }
      return Promise.reject(error);
    }
  }

  // 清除额外缓存
  clearExtraCache() {
    try {
      // 清除会话存储
      sessionStorage.clear();
      
      // 清除特定的本地存储项
      const keysToRemove = [
        'recent_searches',
        'favorite_venues',
        'activity_drafts',
        'user_preferences',
        'chat_history'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      // 清除IndexedDB（如果使用）
      this.clearIndexedDB();
      
    } catch (error) {
      console.error('清除额外缓存失败:', error);
    }
  }

  // 清除IndexedDB
  async clearIndexedDB() {
    try {
      if ('indexedDB' in window) {
        // 这里可以添加清除IndexedDB的逻辑
        console.log('清除IndexedDB缓存');
      }
    } catch (error) {
      console.error('清除IndexedDB失败:', error);
    }
  }

  // 强制退出登录（用于token过期等情况）
  async forceLogout(reason = '登录已过期') {
    this.init();
    
    try {
      await this.userStore.forceLogout(reason);
      
      // 显示强制退出提示
      showToast(`${reason}，请重新登录`);
      
      // 清除所有缓存
      this.clearExtraCache();
      
      // 跳转到登录页面
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      
    } catch (error) {
      console.error('强制退出登录失败:', error);
    }
  }

  // 检查登录状态
  isLoggedIn() {
    this.init();
    return this.userStore.isAuthenticated;
  }

  // 获取当前用户
  getCurrentUser() {
    this.init();
    return this.userStore.currentUser;
  }
}

export default new LogoutHandler();