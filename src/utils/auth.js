import { useUserStore } from '../stores/user.js';
import { showToast, showDialog } from 'vant';

// 权限管理工具类
class AuthManager {
  constructor() {
    this.userStore = null;
  }

  // 初始化用户store
  init() {
    if (!this.userStore) {
      this.userStore = useUserStore();
    }
    return this.userStore;
  }

  // 检查是否已登录
  isAuthenticated() {
    this.init();
    return this.userStore.isAuthenticated;
  }

  // 获取当前用户
  getCurrentUser() {
    this.init();
    return this.userStore.currentUser;
  }

  // 需要登录的页面路径
  protectedRoutes = [
    '/publish',
    '/message',
    '/user/profile',
    '/user/orders',
    '/user/favorites',
    '/user/friends',
    '/user/teams',
    '/user/sports-data',
    '/activity/detail',
    '/venue/detail'
  ];

  // 公开访问的页面路径
  publicRoutes = [
    '/',
    '/basketball',
    '/football',
    '/badminton',
    '/tennis',
    '/pingpong',
    '/billiards',
    '/volleyball',
    '/location',
    '/user' // 个人中心页面本身是公开的，但功能需要登录
  ];

  // 检查路由是否需要登录
  requiresAuth(path) {
    return this.protectedRoutes.some(route => path.startsWith(route));
  }

  // 检查路由是否公开访问
  isPublicRoute(path) {
    return this.publicRoutes.includes(path) || path === '/';
  }

  // 登录检查装饰器
  requireLogin(callback, options = {}) {
    this.init();
    
    if (!this.isAuthenticated()) {
      // 将回调函数传递给登录提示
      const loginOptions = {
        ...options,
        onConfirm: callback
      };
      this.showLoginPrompt(loginOptions);
      return false;
    }
    
    if (typeof callback === 'function') {
      callback();
    }
    return true;
  }

  // 显示登录提示
  showLoginPrompt(options = {}) {
    const {
      title = '需要登录',
      message = '此功能需要登录后才能使用，是否立即登录？',
      showCancel = true,
      confirmText = '立即登录',
      cancelText = '取消',
      onConfirm = null,
      onCancel = null,
      feature = null
    } = options;

    if (showCancel) {
      showDialog({
        title,
        message,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: '#1989fa'
      }).then(() => {
        // 确认登录 - 触发登录弹窗并传递回调
        this.redirectToLogin(feature, onConfirm);
      }).catch(() => {
        // 取消登录
        if (onCancel) {
          onCancel();
        }
      });
    } else {
      showToast(message);
      if (onConfirm) {
        setTimeout(onConfirm, 1000);
      }
    }
  }

  // 跳转到登录页面或显示登录弹窗
  redirectToLogin(feature = null, onSuccess = null) {
    // 生成唯一的操作ID
    const actionId = onSuccess ? Date.now().toString() : null;
    
    // 如果有成功回调，存储到全局登录处理器
    if (onSuccess && actionId) {
      // 导入登录处理器并存储回调
      import('../utils/loginHandler.js').then(({ default: LoginHandler }) => {
        LoginHandler.pendingActions.set(actionId, {
          callback: onSuccess,
          feature,
          timestamp: Date.now()
        });
      });
    }
    
    // 触发全局登录弹窗事件
    const event = new CustomEvent('show-login-dialog', {
      detail: { 
        source: 'auth-manager',
        feature: feature,
        actionId: actionId,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);
  }

  // 检查特定功能权限
  checkFeaturePermission(feature) {
    this.init();
    
    const permissions = {
      'publish': '发布活动',
      'message': '查看消息',
      'join-activity': '参加活动',
      'view-profile': '查看个人资料',
      'add-friend': '添加好友',
      'favorite-venue': '收藏场地',
      'create-team': '创建球队',
      'view-contact': '查看联系方式'
    };

    if (!this.isAuthenticated()) {
      const featureName = permissions[feature] || '此功能';
      this.showLoginPrompt({
        message: `${featureName}需要登录后才能使用，是否立即登录？`
      });
      return false;
    }

    return true;
  }

  // 用户等级权限检查
  checkUserLevel(requiredLevel = 1) {
    this.init();
    
    if (!this.isAuthenticated()) {
      return false;
    }

    const user = this.getCurrentUser();
    const userLevel = user.level || 1;
    
    if (userLevel < requiredLevel) {
      showToast(`此功能需要${requiredLevel}级以上用户才能使用`);
      return false;
    }

    return true;
  }

  // 信用分检查
  checkCreditScore(requiredScore = 60) {
    this.init();
    
    if (!this.isAuthenticated()) {
      return false;
    }

    const creditScore = this.userStore.userStats.creditScore || 0;
    
    if (creditScore < requiredScore) {
      showToast(`此功能需要信用分${requiredScore}以上才能使用`);
      return false;
    }

    return true;
  }

  // 批量权限检查
  checkMultiplePermissions(checks = []) {
    for (const check of checks) {
      const { type, value, message } = check;
      
      switch (type) {
        case 'login':
          if (!this.checkFeaturePermission(value)) return false;
          break;
        case 'level':
          if (!this.checkUserLevel(value)) return false;
          break;
        case 'credit':
          if (!this.checkCreditScore(value)) return false;
          break;
        default:
          break;
      }
    }
    
    return true;
  }
}

export default new AuthManager();