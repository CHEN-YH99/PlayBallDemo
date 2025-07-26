import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  // 通知列表
  const notifications = ref([])
  
  // 未读通知数量
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )
  
  // 通知类型枚举
  const NotificationType = {
    SYSTEM: 'system',           // 系统通知
    ACTIVITY: 'activity',       // 活动相关
    FRIEND: 'friend',          // 好友相关
    MESSAGE: 'message',        // 消息通知
    ANNOUNCEMENT: 'announcement' // 公告通知
  }
  
  // 通知优先级
  const NotificationPriority = {
    LOW: 'low',
    NORMAL: 'normal',
    HIGH: 'high',
    URGENT: 'urgent'
  }
  
  // 添加通知
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      read: false,
      priority: NotificationPriority.NORMAL,
      ...notification
    }
    
    // 按优先级和时间排序插入
    const insertIndex = notifications.value.findIndex(n => 
      getPriorityWeight(n.priority) < getPriorityWeight(newNotification.priority) ||
      (getPriorityWeight(n.priority) === getPriorityWeight(newNotification.priority) && 
       n.timestamp < newNotification.timestamp)
    )
    
    if (insertIndex === -1) {
      notifications.value.push(newNotification)
    } else {
      notifications.value.splice(insertIndex, 0, newNotification)
    }
    
    // 保存到本地存储
    saveToStorage()
    
    return newNotification
  }
  
  // 获取优先级权重
  const getPriorityWeight = (priority) => {
    const weights = {
      [NotificationPriority.LOW]: 1,
      [NotificationPriority.NORMAL]: 2,
      [NotificationPriority.HIGH]: 3,
      [NotificationPriority.URGENT]: 4
    }
    return weights[priority] || 2
  }
  
  // 标记为已读
  const markAsRead = (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
      saveToStorage()
    }
  }
  
  // 标记所有为已读
  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
    saveToStorage()
  }
  
  // 删除通知
  const removeNotification = (id) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
      saveToStorage()
    }
  }
  
  // 清空所有通知
  const clearAll = () => {
    notifications.value = []
    saveToStorage()
  }
  
  // 清空已读通知
  const clearRead = () => {
    notifications.value = notifications.value.filter(n => !n.read)
    saveToStorage()
  }
  
  // 获取指定类型的通知
  const getNotificationsByType = (type) => {
    return notifications.value.filter(n => n.type === type)
  }
  
  // 获取未读通知
  const getUnreadNotifications = () => {
    return notifications.value.filter(n => !n.read)
  }
  
  // 保存到本地存储
  const saveToStorage = () => {
    try {
      localStorage.setItem('playball_notifications', JSON.stringify(notifications.value))
    } catch (error) {
      console.error('保存通知到本地存储失败:', error)
    }
  }
  
  // 从本地存储加载
  const loadFromStorage = () => {
    try {
      const saved = localStorage.getItem('playball_notifications')
      if (saved) {
        const parsed = JSON.parse(saved)
        notifications.value = parsed.map(n => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
      }
    } catch (error) {
      console.error('从本地存储加载通知失败:', error)
      notifications.value = []
    }
  }
  
  // 企业级通知模拟
  const simulateEnterpriseNotifications = () => {
    const notifications = [
      // 系统通知
      {
        type: NotificationType.SYSTEM,
        title: '系统升级完成',
        content: '新版本已上线，新增智能匹配功能和实时聊天系统',
        priority: NotificationPriority.HIGH,
        icon: 'upgrade',
        category: 'system_update',
        tags: ['系统', '升级'],
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天后过期
      },
      
      // 活动相关通知
      {
        type: NotificationType.ACTIVITY,
        title: '活动即将开始',
        content: '您报名的"朝阳公园篮球约战"将在30分钟后开始，请准时到达',
        priority: NotificationPriority.URGENT,
        icon: 'clock-o',
        category: 'activity_reminder',
        tags: ['活动', '提醒'],
        actionText: '查看路线',
        actionData: { 
          activityId: 'act001',
          action: 'navigation',
          location: '朝阳公园篮球场'
        },
        autoExpire: true,
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2小时后过期
      },
      
      // 好友系统通知
      {
        type: NotificationType.FRIEND,
        title: '好友申请',
        content: '篮球达人(技能等级:高级) 想要添加您为好友',
        priority: NotificationPriority.NORMAL,
        icon: 'friends-o',
        category: 'friend_request',
        tags: ['好友', '申请'],
        actionText: '处理申请',
        actionData: { 
          userId: 'user123',
          action: 'friend_request',
          userInfo: {
            name: '篮球达人',
            level: '高级',
            sports: ['篮球']
          }
        },
        requiresAction: true
      },
      
      // 消息通知
      {
        type: NotificationType.MESSAGE,
        title: '新消息 (3条)',
        content: '足球小子、网球王子等人给您发送了消息',
        priority: NotificationPriority.NORMAL,
        icon: 'chat-o',
        category: 'chat_message',
        tags: ['消息', '聊天'],
        actionText: '查看消息',
        actionData: { 
          action: 'open_chat',
          unreadCount: 3,
          senders: ['足球小子', '网球王子', '羽球高手']
        },
        groupable: true // 可以合并同类通知
      },
      
      // 活动推荐
      {
        type: NotificationType.ACTIVITY,
        title: '为您推荐活动',
        content: '根据您的兴趣，为您推荐了3个附近的篮球活动',
        priority: NotificationPriority.LOW,
        icon: 'star-o',
        category: 'activity_recommendation',
        tags: ['推荐', '活动'],
        actionText: '查看推荐',
        actionData: { 
          action: 'view_recommendations',
          count: 3,
          sport: '篮球'
        }
      },
      
      // 安全通知
      {
        type: NotificationType.SYSTEM,
        title: '账户安全提醒',
        content: '检测到您的账户在新设备上登录，如非本人操作请及时修改密码',
        priority: NotificationPriority.HIGH,
        icon: 'shield-o',
        category: 'security_alert',
        tags: ['安全', '登录'],
        actionText: '查看详情',
        actionData: { 
          action: 'security_check',
          device: 'iPhone 15',
          location: '北京市朝阳区',
          time: new Date()
        },
        requiresAction: true,
        persistent: true // 持久化通知，不会自动过期
      }
    ]
    
    // 分批发送通知，模拟真实场景
    notifications.forEach((notification, index) => {
      setTimeout(() => {
        addNotification(notification)
      }, (index + 1) * 3000) // 每3秒发送一个
    })
    
    // 模拟定期推送
    setInterval(() => {
      if (Math.random() < 0.3) { // 30%概率
        const randomNotifications = [
          {
            type: NotificationType.ACTIVITY,
            title: '新活动发布',
            content: '您关注的区域有新的运动活动发布',
            priority: NotificationPriority.LOW,
            icon: 'add-o',
            category: 'new_activity'
          },
          {
            type: NotificationType.FRIEND,
            title: '好友动态',
            content: '您的好友发布了新的运动动态',
            priority: NotificationPriority.LOW,
            icon: 'photo-o',
            category: 'friend_activity'
          }
        ]
        
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        addNotification(randomNotification)
      }
    }, 30000) // 每30秒检查一次
  }
  
  // 批量操作
  const batchMarkAsRead = (ids) => {
    ids.forEach(id => {
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.read = true
      }
    })
    saveToStorage()
  }
  
  // 按分类获取通知
  const getNotificationsByCategory = (category) => {
    return notifications.value.filter(n => n.category === category)
  }
  
  // 获取需要处理的通知
  const getActionRequiredNotifications = () => {
    return notifications.value.filter(n => n.requiresAction && !n.read)
  }
  
  // 清理过期通知
  const cleanExpiredNotifications = () => {
    const now = new Date()
    const beforeCount = notifications.value.length
    
    notifications.value = notifications.value.filter(n => {
      if (n.persistent) return true // 持久化通知不过期
      if (!n.expiresAt) return true // 没有过期时间的保留
      return new Date(n.expiresAt) > now
    })
    
    const removedCount = beforeCount - notifications.value.length
    if (removedCount > 0) {
      console.log(`清理了 ${removedCount} 条过期通知`)
      saveToStorage()
    }
  }
  
  // 通知分组（合并同类通知）
  const groupNotifications = () => {
    const grouped = new Map()
    const ungrouped = []
    
    notifications.value.forEach(notification => {
      if (notification.groupable && notification.category) {
        const key = notification.category
        if (!grouped.has(key)) {
          grouped.set(key, [])
        }
        grouped.get(key).push(notification)
      } else {
        ungrouped.push(notification)
      }
    })
    
    // 合并同类通知
    const result = [...ungrouped]
    for (const [category, items] of grouped) {
      if (items.length > 1) {
        // 创建合并通知
        const latest = items[0]
        const mergedNotification = {
          ...latest,
          id: `merged_${category}_${Date.now()}`,
          title: `${latest.title} (${items.length}条)`,
          content: `您有${items.length}条${latest.type}通知`,
          mergedItems: items,
          isMerged: true
        }
        result.push(mergedNotification)
      } else {
        result.push(items[0])
      }
    }
    
    return result.sort((a, b) => {
      // 按优先级和时间排序
      const priorityDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
      if (priorityDiff !== 0) return priorityDiff
      return new Date(b.timestamp) - new Date(a.timestamp)
    })
  }
  
  // 获取通知统计
  const getNotificationStats = () => {
    const stats = {
      total: notifications.value.length,
      unread: notifications.value.filter(n => !n.read).length,
      urgent: notifications.value.filter(n => n.priority === NotificationPriority.URGENT).length,
      requiresAction: notifications.value.filter(n => n.requiresAction && !n.read).length,
      byType: {},
      byCategory: {}
    }
    
    // 按类型统计
    Object.values(NotificationType).forEach(type => {
      stats.byType[type] = notifications.value.filter(n => n.type === type).length
    })
    
    // 按分类统计
    notifications.value.forEach(n => {
      if (n.category) {
        stats.byCategory[n.category] = (stats.byCategory[n.category] || 0) + 1
      }
    })
    
    return stats
  }
  
  // 初始化
  const initialize = () => {
    loadFromStorage()
    
    // 清理过期通知
    cleanExpiredNotifications()
    
    // 定期清理过期通知
    setInterval(cleanExpiredNotifications, 5 * 60 * 1000) // 每5分钟清理一次
    
    // 开发环境下模拟通知
    if (process.env.NODE_ENV === 'development') {
      simulateEnterpriseNotifications()
    }
  }
  
  return {
    // 状态
    notifications,
    unreadCount,
    
    // 枚举
    NotificationType,
    NotificationPriority,
    
    // 方法
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    clearRead,
    getNotificationsByType,
    getUnreadNotifications,
    batchMarkAsRead,
    getNotificationsByCategory,
    getActionRequiredNotifications,
    groupNotifications,
    getNotificationStats,
    initialize
  }
})