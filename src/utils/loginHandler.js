import { showDialog, showToast } from 'vant';

// 全局登录处理器
class LoginHandler {
  constructor() {
    this.pendingActions = new Map(); // 存储待执行的操作
  }

  // 显示登录提示并处理后续操作
  showLoginPrompt(options = {}) {
    const {
      title = '需要登录',
      message = '此功能需要登录后才能使用，是否立即登录？',
      feature = null,
      redirectPath = null,
      onSuccess = null,
      onCancel = null
    } = options;

    return new Promise((resolve, reject) => {
      showDialog({
        title,
        message,
        showCancelButton: true,
        confirmButtonText: '立即登录',
        cancelButtonText: '取消',
        confirmButtonColor: '#1989fa'
      }).then(() => {
        // 用户选择登录
        this.triggerLogin({
          feature,
          redirectPath,
          onSuccess,
          source: 'login-handler'
        });
        resolve(true);
      }).catch(() => {
        // 用户取消登录
        if (onCancel) {
          onCancel();
        }
        reject(false);
      });
    });
  }

  // 触发登录弹窗
  triggerLogin(options = {}) {
    const {
      feature = null,
      redirectPath = null,
      onSuccess = null,
      source = 'unknown'
    } = options;

    // 生成唯一的操作ID
    const actionId = Date.now().toString();
    
    // 存储待执行的操作
    if (onSuccess) {
      this.pendingActions.set(actionId, {
        callback: onSuccess,
        feature,
        redirectPath,
        timestamp: Date.now()
      });
    }

    // 触发全局登录事件
    const event = new CustomEvent('show-login-dialog', {
      detail: {
        source,
        feature,
        redirectPath,
        actionId,
        timestamp: Date.now()
      }
    });
    window.dispatchEvent(event);
  }

  // 处理登录成功
  handleLoginSuccess(actionId) {
    if (actionId && this.pendingActions.has(actionId)) {
      const action = this.pendingActions.get(actionId);
      
      // 执行回调
      if (action.callback) {
        setTimeout(() => {
          action.callback();
        }, 500);
      }
      
      // 清除已执行的操作
      this.pendingActions.delete(actionId);
    }
  }

  // 清理过期的待执行操作
  cleanupExpiredActions() {
    const now = Date.now();
    const expireTime = 5 * 60 * 1000; // 5分钟过期
    
    for (const [actionId, action] of this.pendingActions.entries()) {
      if (now - action.timestamp > expireTime) {
        this.pendingActions.delete(actionId);
      }
    }
  }

  // 快捷方法：需要登录才能执行的操作
  requireLogin(callback, featureName = '此功能') {
    return this.showLoginPrompt({
      message: `${featureName}需要登录后才能使用，是否立即登录？`,
      onSuccess: callback
    });
  }

  // 快捷方法：查看功能需要登录
  requireLoginForView(viewName, callback) {
    return this.showLoginPrompt({
      message: `查看${viewName}需要登录，是否立即登录？`,
      feature: 'view-content',
      onSuccess: callback
    });
  }

  // 快捷方法：操作功能需要登录
  requireLoginForAction(actionName, callback) {
    return this.showLoginPrompt({
      message: `${actionName}需要登录后才能使用，是否立即登录？`,
      feature: 'user-action',
      onSuccess: callback
    });
  }
}

export default new LoginHandler();