import { useUserStore } from '../stores/user.js'
import { showConfirmDialog, showToast } from 'vant'

/**
 * 认证守卫 - 检查用户是否已登录
 * @param {Object} options 配置选项
 * @param {string} options.message 未登录时的提示消息
 * @param {string} options.title 确认对话框标题
 * @param {boolean} options.showDialog 是否显示确认对话框
 * @param {Function} options.onSuccess 认证成功回调
 * @param {Function} options.onFail 认证失败回调
 * @param {Object} options.router Vue Router实例
 * @returns {Promise<boolean>} 是否通过认证
 */
export const requireAuth = async (options = {}) => {
  const {
    message = '此功能需要登录后使用',
    title = '需要登录',
    showDialog = true,
    onSuccess,
    onFail,
    router
  } = options

  const userStore = useUserStore()

  // 检查是否已登录
  if (userStore.isAuthenticated) {
    // 认证成功
    if (onSuccess) {
      await onSuccess(userStore.currentUser)
    }
    return true
  }

  // 未登录处理
  if (showDialog) {
    try {
      await showConfirmDialog({
        title,
        message: `${message}，是否前往登录？`,
        confirmButtonText: '去登录',
        cancelButtonText: '取消'
      })
      
      // 用户确认登录，跳转到登录页
      if (router) {
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath }
        })
      }
    } catch {
      // 用户取消登录
      if (onFail) {
        await onFail('用户取消登录')
      }
    }
  } else {
    // 不显示对话框，直接提示
    showToast(message)
    if (onFail) {
      await onFail('未登录')
    }
  }

  return false
}

/**
 * 检查用户权限
 * @param {string|Array} permissions 需要的权限
 * @param {Object} user 用户信息
 * @returns {boolean} 是否有权限
 */
export const hasPermission = (permissions, user = null) => {
  const userStore = useUserStore()
  const currentUser = user || userStore.currentUser

  if (!currentUser) return false

  // 如果是字符串，转换为数组
  const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions]
  
  // 检查用户权限
  const userPermissions = currentUser.permissions || []
  
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission) || userPermissions.includes('admin')
  )
}

/**
 * 权限守卫 - 检查用户是否有特定权限
 * @param {string|Array} permissions 需要的权限
 * @param {Object} options 配置选项
 * @returns {Promise<boolean>} 是否通过权限检查
 */
export const requirePermission = async (permissions, options = {}) => {
  const {
    message = '您没有权限执行此操作',
    onSuccess,
    onFail
  } = options

  // 先检查是否登录
  const isAuthenticated = await requireAuth({
    ...options,
    showDialog: false
  })

  if (!isAuthenticated) return false

  // 检查权限
  if (hasPermission(permissions)) {
    if (onSuccess) {
      await onSuccess()
    }
    return true
  }

  // 权限不足
  showToast(message)
  if (onFail) {
    await onFail('权限不足')
  }

  return false
}

/**
 * 创建认证装饰器
 * @param {Object} options 配置选项
 * @returns {Function} 装饰器函数
 */
export const withAuth = (options = {}) => {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args) {
      const isAuthenticated = await requireAuth(options)
      if (isAuthenticated) {
        return originalMethod.apply(this, args)
      }
    }

    return descriptor
  }
}

/**
 * Vue组合式API认证钩子
 * @param {Object} options 配置选项
 * @returns {Object} 认证相关的响应式数据和方法
 */
export const useAuth = (options = {}) => {
  const userStore = useUserStore()

  const checkAuth = async (customOptions = {}) => {
    return await requireAuth({ ...options, ...customOptions })
  }

  const checkPermission = async (permissions, customOptions = {}) => {
    return await requirePermission(permissions, { ...options, ...customOptions })
  }

  return {
    user: userStore.currentUser,
    isAuthenticated: userStore.isAuthenticated,
    checkAuth,
    checkPermission,
    hasPermission: (permissions) => hasPermission(permissions),
    login: userStore.login,
    logout: userStore.logout
  }
}

/**
 * 路由守卫 - 用于Vue Router
 * @param {Object} to 目标路由
 * @param {Object} from 来源路由
 * @param {Function} next 导航守卫回调
 */
export const authGuard = async (to, from, next) => {
  const userStore = useUserStore()

  // 检查路由是否需要认证
  if (to.meta?.requiresAuth) {
    if (userStore.isAuthenticated) {
      // 检查权限
      if (to.meta?.permissions) {
        if (hasPermission(to.meta.permissions)) {
          next()
        } else {
          showToast('您没有权限访问此页面')
          next(false)
        }
      } else {
        next()
      }
    } else {
      // 未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
}

/**
 * 批量认证检查
 * @param {Array} actions 需要认证的操作列表
 * @param {Object} options 配置选项
 * @returns {Promise<Object>} 认证结果
 */
export const batchAuth = async (actions, options = {}) => {
  const results = {}
  
  for (const action of actions) {
    const { name, permissions, ...actionOptions } = action
    
    if (permissions) {
      results[name] = await requirePermission(permissions, {
        ...options,
        ...actionOptions,
        showDialog: false
      })
    } else {
      results[name] = await requireAuth({
        ...options,
        ...actionOptions,
        showDialog: false
      })
    }
  }
  
  return results
}

export default {
  requireAuth,
  requirePermission,
  hasPermission,
  withAuth,
  useAuth,
  authGuard,
  batchAuth
}