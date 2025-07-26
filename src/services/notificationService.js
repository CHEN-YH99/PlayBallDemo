import { useNotificationStore } from '../stores/notificationStore.js'

class NotificationService {
  constructor() {
    this.store = null
    this.eventSource = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  // 初始化服务
  initialize(store) {
    this.store = store || useNotificationStore()
    this.setupEventListeners()
    this.startHeartbeat()
  }

  // 设置事件监听器
  setupEventListeners() {
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.handlePageVisible()
      } else {
        this.handlePageHidden()
      }
    })

    // 监听网络状态变化
    window.addEventListener('online', () => {
      this.handleNetworkOnline()
    })

    window.addEventListener('offline', () => {
      this.handleNetworkOffline()
    })
  }

  // 页面变为可见时的处理
  handlePageVisible() {
    console.log('页面变为可见，检查新通知')
    this.checkForNewNotifications()
  }

  // 页面隐藏时的处理
  handlePageHidden() {
    console.log('页面隐藏')
  }

  // 网络连接恢复时的处理
  handleNetworkOnline() {
    console.log('网络连接恢复')
    this.reconnectEventSource()
  }

  // 网络断开时的处理
  handleNetworkOffline() {
    console.log('网络连接断开')
    this.closeEventSource()
  }

  // 启动心跳检测
  startHeartbeat() {
    setInterval(() => {
      this.checkConnection()
    }, 30000) // 每30秒检查一次连接状态
  }

  // 检查连接状态
  checkConnection() {
    if (navigator.onLine) {
      this.checkForNewNotifications()
    }
  }

  // 检查新通知
  async checkForNewNotifications() {
    try {
      // 模拟API调用检查新通知
      const response = await this.fetchNotifications()
      if (response && response.notifications) {
        response.notifications.forEach(notification => {
          this.store.addNotification(notification)
        })
      }
    } catch (error) {
      console.error('检查新通知失败:', error)
    }
  }

  // 模拟获取通知的API调用
  async fetchNotifications() {
    // 在实际应用中，这里应该是真实的API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        // 随机生成一些通知用于演示
        const notifications = this.generateRandomNotifications()
        resolve({ notifications })
      }, 1000)
    })
  }

  // 生成随机通知（用于演示）
  generateRandomNotifications() {
    const notifications = []
    const random = Math.random()

    if (random < 0.1) { // 10%概率生成通知
      const notificationTypes = [
        {
          type: 'activity',
          title: '活动提醒',
          content: '您关注的活动即将开始',
          priority: 'high',
          icon: 'calendar-o'
        },
        {
          type: 'friend',
          title: '好友动态',
          content: '您的好友发布了新动态',
          priority: 'normal',
          icon: 'friends-o'
        },
        {
          type: 'message',
          title: '新消息',
          content: '您收到了一条新消息',
          priority: 'normal',
          icon: 'chat-o'
        },
        {
          type: 'system',
          title: '系统通知',
          content: '系统更新完成',
          priority: 'low',
          icon: 'setting-o'
        }
      ]

      const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
      notifications.push(randomNotification)
    }

    return notifications
  }

  // 建立EventSource连接（用于实时通知）
  connectEventSource() {
    if (this.eventSource) {
      this.closeEventSource()
    }

    try {
      // 在实际应用中，这里应该连接到真实的SSE端点
      // this.eventSource = new EventSource('/api/notifications/stream')
      
      // 模拟EventSource连接
      this.simulateEventSource()
    } catch (error) {
      console.error('连接EventSource失败:', error)
      this.scheduleReconnect()
    }
  }

  // 模拟EventSource连接
  simulateEventSource() {
    console.log('模拟EventSource连接已建立')
    
    // 模拟定期接收通知
    const interval = setInterval(() => {
      if (Math.random() < 0.05) { // 5%概率接收通知
        const notification = this.generateRandomNotifications()[0]
        if (notification) {
          this.handleIncomingNotification(notification)
        }
      }
    }, 10000) // 每10秒检查一次

    // 保存interval ID以便清理
    this.eventSourceInterval = interval
  }

  // 处理接收到的通知
  handleIncomingNotification(notification) {
    console.log('收到新通知:', notification)
    
    if (this.store) {
      this.store.addNotification(notification)
      
      // 如果页面不可见，显示浏览器通知
      if (document.visibilityState === 'hidden') {
        this.showBrowserNotification(notification)
      }
    }
  }

  // 显示浏览器通知
  async showBrowserNotification(notification) {
    if (!('Notification' in window)) {
      console.log('浏览器不支持通知')
      return
    }

    let permission = Notification.permission

    if (permission === 'default') {
      permission = await Notification.requestPermission()
    }

    if (permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.content,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: notification.priority === 'urgent'
      })

      browserNotification.onclick = () => {
        window.focus()
        browserNotification.close()
        
        // 可以在这里处理通知点击事件
        if (notification.actionData) {
          this.handleNotificationAction(notification)
        }
      }

      // 自动关闭通知
      setTimeout(() => {
        browserNotification.close()
      }, 5000)
    }
  }

  // 处理通知动作
  handleNotificationAction(notification) {
    // 这里可以根据通知类型执行相应的动作
    console.log('处理通知动作:', notification)
  }

  // 关闭EventSource连接
  closeEventSource() {
    if (this.eventSource) {
      this.eventSource.close()
      this.eventSource = null
    }
    
    if (this.eventSourceInterval) {
      clearInterval(this.eventSourceInterval)
      this.eventSourceInterval = null
    }
  }

  // 重新连接EventSource
  reconnectEventSource() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect()
    } else {
      console.error('达到最大重连次数，停止重连')
    }
  }

  // 安排重连
  scheduleReconnect() {
    setTimeout(() => {
      this.reconnectAttempts++
      console.log(`尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      this.connectEventSource()
    }, this.reconnectDelay * this.reconnectAttempts)
  }

  // 发送通知
  sendNotification(notification) {
    if (this.store) {
      return this.store.addNotification(notification)
    }
  }

  // 用户交互跟踪
  trackUserInteraction(action, data = {}) {
    const interaction = {
      action,
      timestamp: new Date(),
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    console.log('用户交互:', interaction)
    
    // 在实际应用中，这里应该发送到分析服务
    this.sendAnalytics('user_interaction', interaction)
  }

  // 发送分析数据
  sendAnalytics(event, data) {
    // 模拟发送分析数据
    if (window.gtag) {
      window.gtag('event', event, data)
    }
    
    // 或者发送到自定义分析服务
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ event, data })
    // })
  }

  // 获取通知统计
  getNotificationStats() {
    if (!this.store) return null
    
    return this.store.getNotificationStats()
  }

  // 销毁服务
  destroy() {
    this.closeEventSource()
    
    // 移除事件监听器
    document.removeEventListener('visibilitychange', this.handlePageVisible)
    window.removeEventListener('online', this.handleNetworkOnline)
    window.removeEventListener('offline', this.handleNetworkOffline)
  }
}

// 创建单例实例
export const notificationService = new NotificationService()

// 导出服务类
export default NotificationService