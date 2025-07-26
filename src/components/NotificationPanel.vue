<script setup>
import { ref, computed, onMounted } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
import { useNotificationStore } from '../stores/notificationStore.js'

const notificationStore = useNotificationStore()
const showPanel = ref(false)
const activeTab = ref('all')

// 计算属性
const filteredNotifications = computed(() => {
  if (activeTab.value === 'all') {
    return notificationStore.notifications
  } else if (activeTab.value === 'unread') {
    return notificationStore.getUnreadNotifications()
  } else {
    return notificationStore.getNotificationsByType(activeTab.value)
  }
})

// 标签页配置
const tabs = [
  { key: 'all', label: '全部', icon: 'bell' },
  { key: 'unread', label: '未读', icon: 'bell-o' },
  { key: 'system', label: '系统', icon: 'setting-o' },
  { key: 'activity', label: '活动', icon: 'calendar-o' },
  { key: 'friend', label: '好友', icon: 'friends-o' },
  { key: 'message', label: '消息', icon: 'chat-o' }
]

// 获取通知图标
const getNotificationIcon = (notification) => {
  return notification.icon || getDefaultIcon(notification.type)
}

// 获取默认图标
const getDefaultIcon = (type) => {
  const iconMap = {
    system: 'setting-o',
    activity: 'calendar-o',
    friend: 'friends-o',
    message: 'chat-o',
    announcement: 'volume-o'
  }
  return iconMap[type] || 'bell-o'
}

// 获取优先级颜色
const getPriorityColor = (priority) => {
  const colorMap = {
    low: '#969799',
    normal: '#1989fa',
    high: '#ff976a',
    urgent: '#ee0a24'
  }
  return colorMap[priority] || '#1989fa'
}

// 格式化时间
const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diff = now - time
  
  if (diff < 60000) { // 1分钟内
    return '刚刚'
  } else if (diff < 3600000) { // 1小时内
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 24小时内
    return `${Math.floor(diff / 3600000)}小时前`
  } else if (diff < 604800000) { // 7天内
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return time.toLocaleDateString()
  }
}

// 处理通知点击
const handleNotificationClick = (notification) => {
  // 标记为已读
  if (!notification.read) {
    notificationStore.markAsRead(notification.id)
  }
  
  // 处理动作
  if (notification.actionData) {
    handleNotificationAction(notification)
  } else {
    showToast(`查看通知: ${notification.title}`)
  }
}

// 处理通知动作
const handleNotificationAction = (notification) => {
  const { type, actionData } = notification
  
  switch (type) {
    case 'activity':
      // 跳转到活动详情
      showToast(`跳转到活动: ${actionData.activityId}`)
      break
    case 'friend':
      // 跳转到好友申请
      showToast(`查看好友申请: ${actionData.userId}`)
      break
    case 'message':
      // 跳转到聊天
      showToast(`打开聊天: ${actionData.chatId}`)
      break
    default:
      showToast('查看详情')
  }
}

// 删除通知
const handleDelete = async (notification) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: '确定要删除这条通知吗？'
    })
    
    notificationStore.removeNotification(notification.id)
    showToast('删除成功')
  } catch {
    // 用户取消
  }
}

// 标记所有为已读
const markAllRead = () => {
  notificationStore.markAllAsRead()
  showToast('已全部标记为已读')
}

// 清空已读通知
const clearReadNotifications = async () => {
  try {
    await showConfirmDialog({
      title: '确认清空',
      message: '确定要清空所有已读通知吗？'
    })
    
    notificationStore.clearRead()
    showToast('已清空已读通知')
  } catch {
    // 用户取消
  }
}

// 清空所有通知
const clearAllNotifications = async () => {
  try {
    await showConfirmDialog({
      title: '确认清空',
      message: '确定要清空所有通知吗？此操作不可恢复。'
    })
    
    notificationStore.clearAll()
    showToast('已清空所有通知')
  } catch {
    // 用户取消
  }
}

// 暴露方法给父组件
const togglePanel = (show) => {
  showPanel.value = show !== undefined ? show : !showPanel.value
}

defineExpose({
  togglePanel
})

onMounted(() => {
  notificationStore.initialize()
})
</script>

<template>
  <van-popup 
    v-model:show="showPanel" 
    position="top" 
    :style="{ height: '80vh', marginTop: '54px' }"
    round
    closeable
    close-icon-position="top-right"
  >
    <div class="notification-panel">
      <!-- 头部 -->
      <div class="panel-header">
        <h2 class="panel-title">
          <van-icon name="bell" />
          通知中心
          <van-badge 
            v-if="notificationStore.unreadCount > 0" 
            :content="notificationStore.unreadCount" 
            max="99"
          />
        </h2>
        
        <!-- 操作按钮 -->
        <div class="header-actions">
          <van-button 
            size="mini" 
            type="primary" 
            plain
            @click="markAllRead"
            :disabled="notificationStore.unreadCount === 0"
          >
            全部已读
          </van-button>
          
          <van-dropdown-menu>
            <van-dropdown-item title="更多操作">
              <div class="dropdown-actions">
                <van-cell 
                  title="清空已读" 
                  icon="delete-o"
                  is-link
                  @click="clearReadNotifications"
                />
                <van-cell 
                  title="清空全部" 
                  icon="clear"
                  is-link
                  @click="clearAllNotifications"
                />
              </div>
            </van-dropdown-item>
          </van-dropdown-menu>
        </div>
      </div>
      
      <!-- 标签页 -->
      <van-tabs v-model:active="activeTab" sticky>
        <van-tab 
          v-for="tab in tabs" 
          :key="tab.key"
          :name="tab.key"
          :title="tab.label"
        >
          <template #title>
            <van-icon :name="tab.icon" />
            {{ tab.label }}
            <van-badge 
              v-if="tab.key === 'unread' && notificationStore.unreadCount > 0"
              :content="notificationStore.unreadCount"
              max="99"
            />
          </template>
        </van-tab>
      </van-tabs>
      
      <!-- 通知列表 -->
      <div class="notification-list">
        <van-empty 
          v-if="filteredNotifications.length === 0"
          image="search"
          description="暂无通知"
        />
        
        <van-swipe-cell 
          v-for="notification in filteredNotifications"
          :key="notification.id"
          class="notification-item"
        >
          <div 
            class="notification-content"
            :class="{ unread: !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <!-- 优先级指示器 -->
            <div 
              class="priority-indicator"
              :style="{ backgroundColor: getPriorityColor(notification.priority) }"
            />
            
            <!-- 图标 -->
            <div class="notification-icon">
              <van-icon 
                :name="getNotificationIcon(notification)" 
                :color="getPriorityColor(notification.priority)"
                size="20"
              />
            </div>
            
            <!-- 内容 -->
            <div class="notification-body">
              <div class="notification-header">
                <h4 class="notification-title">{{ notification.title }}</h4>
                <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
              </div>
              
              <p class="notification-text">{{ notification.content }}</p>
              
              <!-- 动作按钮 -->
              <div v-if="notification.actionText" class="notification-actions">
                <van-button 
                  size="mini" 
                  type="primary" 
                  plain
                  @click.stop="handleNotificationAction(notification)"
                >
                  {{ notification.actionText }}
                </van-button>
              </div>
            </div>
            
            <!-- 未读标识 -->
            <div v-if="!notification.read" class="unread-dot" />
          </div>
          
          <!-- 滑动操作 -->
          <template #right>
            <van-button 
              square 
              type="danger" 
              text="删除"
              @click="handleDelete(notification)"
            />
          </template>
        </van-swipe-cell>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.notification-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
  
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #fff;
    border-bottom: 1px solid #ebedf0;
    
    .panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #323233;
      
      .van-icon {
        color: #1989fa;
      }
    }
    
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  }
  
  .notification-list {
    flex: 1;
    overflow-y: auto;
    
    .notification-item {
      margin-bottom: 1px;
      
      .notification-content {
        display: flex;
        align-items: flex-start;
        padding: 16px 20px;
        background: #fff;
        position: relative;
        cursor: pointer;
        transition: background-color 0.3s ease;
        
        &:hover {
          background: #f7f8fa;
        }
        
        &.unread {
          background: #f0f9ff;
          
          &:hover {
            background: #e6f4ff;
          }
        }
        
        .priority-indicator {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
        }
        
        .notification-icon {
          margin-right: 12px;
          margin-top: 2px;
        }
        
        .notification-body {
          flex: 1;
          
          .notification-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
            
            .notification-title {
              margin: 0;
              font-size: 15px;
              font-weight: 500;
              color: #323233;
              line-height: 1.4;
            }
            
            .notification-time {
              font-size: 12px;
              color: #969799;
              white-space: nowrap;
              margin-left: 12px;
            }
          }
          
          .notification-text {
            margin: 0 0 8px 0;
            font-size: 14px;
            color: #646566;
            line-height: 1.5;
            word-break: break-word;
          }
          
          .notification-actions {
            margin-top: 8px;
          }
        }
        
        .unread-dot {
          width: 8px;
          height: 8px;
          background: #ee0a24;
          border-radius: 50%;
          margin-left: 8px;
          margin-top: 6px;
          flex-shrink: 0;
        }
      }
    }
  }
}

.dropdown-actions {
  .van-cell {
    padding: 12px 16px;
    
    &:not(:last-child) {
      border-bottom: 1px solid #ebedf0;
    }
  }
}

// 标签页样式调整
:deep(.van-tabs__nav) {
  background: #fff;
  
  .van-tab {
    .van-icon {
      margin-right: 4px;
    }
  }
}

:deep(.van-tabs__content) {
  padding: 0;
}
</style>