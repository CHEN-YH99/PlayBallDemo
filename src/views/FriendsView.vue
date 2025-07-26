<template>
  <div class="friends-view">
    <!-- 头部导航 -->
    <van-nav-bar
      title="好友列表"
      left-arrow
      @click-left="router.back()"
    />
    
    <!-- 搜索栏 -->
    <van-search
      v-model="searchQuery"
      placeholder="搜索好友"
      @search="searchFriends"
      @input="searchFriends"
    />
    
    <!-- 好友列表 -->
    <van-pull-refresh v-model="loading" @refresh="loadFriends">
      <van-list>
        <van-cell
          v-for="friend in friends"
          :key="friend.id"
          class="friend-item"
          @click="viewFriendDetail(friend)"
        >
          <template #icon>
            <div class="friend-avatar">
              <van-image
                :src="friend.avatar"
                round
                width="50"
                height="50"
              />
              <div 
                class="status-dot"
                :class="friend.status"
              />
            </div>
          </template>
          <template #title>
            <div class="friend-info">
              <div class="friend-name">{{ friend.name }}</div>
              <div class="friend-sports">
                <van-tag
                  v-for="sport in friend.sports"
                  :key="sport"
                  size="mini"
                  type="primary"
                  plain
                >
                  {{ sport }}
                </van-tag>
              </div>
            </div>
          </template>
          <template #label>
            <div class="friend-details">
              <div class="friend-level">{{ friend.level }}</div>
              <div class="friend-location">{{ friend.location }}</div>
              <div class="friend-active">{{ friend.lastActive }}</div>
            </div>
          </template>
          <template #right-icon>
            <van-button
              size="small"
              type="primary"
              plain
              @click.stop="sendMessage(friend)"
            >
              消息
            </van-button>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    
    <!-- 空状态 -->
    <van-empty
      v-if="!loading && friends.length === 0"
      image="search"
      description="暂无好友"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { requireAuth } from '../utils/authGuard.js'
import { showToast } from 'vant'

const router = useRouter()
const userStore = useUserStore()

// 页面状态
const loading = ref(false)
const friends = ref([])
const searchQuery = ref('')

// 模拟好友数据
const mockFriends = [
  {
    id: 1,
    name: '篮球达人',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    sports: ['篮球', '足球'],
    level: '高级',
    location: '北京市朝阳区',
    status: 'online',
    lastActive: '刚刚'
  },
  {
    id: 2,
    name: '足球小子',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    sports: ['足球', '跑步'],
    level: '中级',
    location: '上海市浦东新区',
    status: 'offline',
    lastActive: '2小时前'
  },
  {
    id: 3,
    name: '羽球高手',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    sports: ['羽毛球', '网球'],
    level: '高级',
    location: '广州市天河区',
    status: 'online',
    lastActive: '刚刚'
  }
]

// 加载好友列表
const loadFriends = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    friends.value = mockFriends
  } catch (error) {
    showToast('加载好友列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索好友
const searchFriends = () => {
  if (!searchQuery.value.trim()) {
    friends.value = mockFriends
    return
  }
  friends.value = mockFriends.filter(friend => 
    friend.name.includes(searchQuery.value) ||
    friend.sports.some(sport => sport.includes(searchQuery.value)) ||
    friend.location.includes(searchQuery.value)
  )
}

// 查看好友详情
const viewFriendDetail = async (friend) => {
  const isAuth = await requireAuth({
    message: '查看好友详情需要登录',
    router,
    onSuccess: () => {
      router.push(`/friend/${friend.id}`)
    }
  })
}

// 发送消息
const sendMessage = async (friend) => {
  const isAuth = await requireAuth({
    message: '发送消息需要登录',
    router,
    onSuccess: () => {
      showToast(`向${friend.name}发送消息`)
      // 这里可以跳转到聊天页面
    }
  })
}

// 页面初始化
onMounted(async () => {
  const isAuth = await requireAuth({
    message: '查看好友列表需要登录',
    router,
    onSuccess: () => {
      loadFriends()
    },
    onFail: () => {
      router.back()
    }
  })
})
</script>

<style lang="scss" scoped>
.friends-view {
  min-height: 100vh;
  background: #f7f8fa;
}

.friend-item {
  margin-bottom: 1px;
  
  .friend-avatar {
    position: relative;
    margin-right: 12px;
    
    .status-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #fff;
      
      &.online {
        background: #07c160;
      }
      
      &.offline {
        background: #969799;
      }
    }
  }
  
  .friend-info {
    .friend-name {
      font-size: 16px;
      font-weight: 500;
      color: #323233;
      margin-bottom: 4px;
    }
    
    .friend-sports {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
    }
  }
  
  .friend-details {
    font-size: 12px;
    color: #969799;
    
    .friend-level {
      color: #1989fa;
      font-weight: 500;
    }
    
    .friend-location {
      margin: 2px 0;
    }
  }
}
</style>