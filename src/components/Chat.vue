<template>
  <div class="chat-view">
    <!-- 自定义头部 -->
    <div class="chat-header">
      <div class="header-left">
        <van-icon name="arrow-left" size="20" @click="goBack" />
      </div>
      <div class="header-center">
        <div class="chat-title">消息</div>
      </div>
      <div class="header-right">
        <van-icon name="add-o" size="20" @click="showAddOptions" />
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-container">
      <div class="search-input">
        <van-icon name="search" size="16" color="#999" />
        <input
          v-model="searchQuery"
          placeholder="搜索聊天记录"
          class="search-field"
          @input="handleSearchInput"
        />
        <van-icon 
          v-if="searchQuery" 
          name="clear" 
          size="16" 
          color="#999" 
          @click="clearSearch"
        />
      </div>
    </div>

    <!-- 聊天列表 -->
    <div class="chat-list-container">
      <van-pull-refresh v-model="loading" @refresh="loadChatList">
        <van-list>
          <van-cell
            v-for="chat in filteredChats"
            :key="chat.id"
            class="chat-item"
            @click="openChat(chat)"
          >
          <template #icon>
            <div class="chat-avatar">
              <van-image
                :src="chat.avatar"
                round
                width="50"
                height="50"
              />
              <van-badge
                v-if="chat.unreadCount > 0"
                :content="chat.unreadCount > 99 ? '99+' : chat.unreadCount"
                class="unread-badge"
              />
              <div 
                v-if="chat.isOnline"
                class="online-dot"
              />
            </div>
          </template>
          
          <template #title>
            <div class="chat-info">
              <div class="chat-name">{{ chat.name }}</div>
              <div class="chat-time">{{ chat.lastMessageTime }}</div>
            </div>
          </template>
          
          <template #label>
            <div class="last-message">
              <van-icon 
                v-if="chat.lastMessage.type === 'image'" 
                name="photograph" 
                size="14" 
              />
              <van-icon 
                v-else-if="chat.lastMessage.type === 'voice'" 
                name="volume-o" 
                size="14" 
              />
              <span>{{ chat.lastMessage.content }}</span>
            </div>
          </template>
          
          <template #right-icon>
            <div class="chat-status">
              <van-icon 
                v-if="chat.isMuted" 
                name="volume-o" 
                color="#c8c9cc" 
                size="16" 
              />
              <van-icon 
                v-if="chat.isPinned" 
                name="star" 
                color="#ff976a" 
                size="16" 
              />
            </div>
          </template>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 空状态 -->
    <van-empty
      v-if="!loading && filteredChats.length === 0"
      image="chat-o"
      description="暂无聊天记录"
    />

    <!-- 添加选项 -->
    <van-action-sheet
      v-model:show="showAddSheet"
      :actions="addActions"
      @select="handleAddAction"
      cancel-text="取消"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 页面状态
const loading = ref(false)
const searchQuery = ref('')
const showAddSheet = ref(false)

// 聊天列表数据
const chatList = ref([
  {
    id: 1,
    name: '篮球群聊',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    lastMessage: {
      content: '19:00开始打球，大家准时到场',
      type: 'text'
    },
    lastMessageTime: '14:32',
    unreadCount: 3,
    isOnline: true,
    isMuted: false,
    isPinned: true,
    type: 'group'
  },
  {
    id: 2,
    name: '小明',
    avatar: 'https://img.yzcdn.cn/vant/apple-1.jpg',
    lastMessage: {
      content: '明天一起打羽毛球吗？',
      type: 'text'
    },
    lastMessageTime: '昨天',
    unreadCount: 1,
    isOnline: true,
    isMuted: false,
    isPinned: false,
    type: 'private'
  },
  {
    id: 3,
    name: '足球爱好者',
    avatar: 'https://img.yzcdn.cn/vant/apple-2.jpg',
    lastMessage: {
      content: '[图片]',
      type: 'image'
    },
    lastMessageTime: '昨天',
    unreadCount: 0,
    isOnline: false,
    isMuted: true,
    isPinned: false,
    type: 'group'
  },
  {
    id: 4,
    name: '小红',
    avatar: 'https://img.yzcdn.cn/vant/apple-3.jpg',
    lastMessage: {
      content: '[语音]',
      type: 'voice'
    },
    lastMessageTime: '周二',
    unreadCount: 0,
    isOnline: false,
    isMuted: false,
    isPinned: false,
    type: 'private'
  },
  {
    id: 5,
    name: '网球俱乐部',
    avatar: 'https://img.yzcdn.cn/vant/apple-4.jpg',
    lastMessage: {
      content: '周末活动安排已发布',
      type: 'text'
    },
    lastMessageTime: '周一',
    unreadCount: 0,
    isOnline: false,
    isMuted: false,
    isPinned: false,
    type: 'group'
  }
])

// 添加选项
const addActions = [
  { name: 'new-chat', text: '发起聊天', icon: 'chat-o' },
  { name: 'add-friend', text: '添加好友', icon: 'friends-o' },
  { name: 'create-group', text: '创建群聊', icon: 'add-square' },
  { name: 'scan', text: '扫一扫', icon: 'scan' }
]

// 计算属性
const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) {
    // 按置顶和时间排序
    return chatList.value.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return 0
    })
  }
  
  return chatList.value.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    chat.lastMessage.content.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

// 方法
const loadChatList = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 这里可以刷新聊天列表数据
  } catch (error) {
    showToast('加载聊天列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = (value) => {
  // 搜索聊天
}

const handleSearchInput = (event) => {
  searchQuery.value = event.target.value
}

const clearSearch = () => {
  searchQuery.value = ''
}

const goBack = () => {
  // 返回到首页
  router.push('/basketball')
}

const openChat = (chat) => {
  // 跳转到聊天详情页面，传递聊天信息
  router.push({
    path: `/chat/${chat.id}`,
    query: {
      name: chat.name,
      avatar: chat.avatar,
      type: chat.type
    }
  })
}

const showAddOptions = () => {
  showAddSheet.value = true
}

const handleAddAction = (action) => {
  switch (action.name) {
    case 'new-chat':
      showToast('发起聊天')
      break
    case 'add-friend':
      router.push('/friends')
      break
    case 'create-group':
      showToast('创建群聊')
      break
    case 'scan':
      showToast('扫一扫')
      break
  }
}

// 页面初始化
onMounted(() => {
  loadChatList()
})
</script>

<style lang="scss" scoped>
.chat-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f8fa;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: #f7f7f7;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 16px;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
  
  .header-left, .header-right {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    
    &:active {
      background: rgba(0, 0, 0, 0.05);
    }
  }
  
  .header-center {
    flex: 1;
    display: flex;
    justify-content: center;
    
    .chat-title {
      font-size: 17px;
      font-weight: 500;
      color: #000;
    }
  }
}

.search-container {
  background: #f7f7f7;
  padding: 8px 16px 12px;
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}

.search-input {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 8px 12px;
  gap: 8px;
}

.search-field {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #000;
  
  &::placeholder {
    color: #999;
  }
}

.chat-list-container {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  margin-bottom: 1px;
  background: #fff;
  
  .chat-avatar {
    position: relative;
    margin-right: 12px;
    
    .unread-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 1;
    }
    
    .online-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background: #07c160;
      border: 2px solid #fff;
      border-radius: 50%;
    }
  }
  
  .chat-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    
    .chat-name {
      font-size: 16px;
      font-weight: 500;
      color: #323233;
    }
    
    .chat-time {
      font-size: 12px;
      color: #969799;
      flex-shrink: 0;
    }
  }
  
  .last-message {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #646566;
    margin-top: 4px;
    
    .van-icon {
      flex-shrink: 0;
    }
    
    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .chat-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
}

// 移除不需要的深度选择器样式
</style>