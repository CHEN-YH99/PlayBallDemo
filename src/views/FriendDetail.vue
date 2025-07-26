<template>
  <div class="friend-detail">
    <!-- 头部导航 -->
    <van-nav-bar
      title="好友详情"
      left-arrow
      @click-left="router.back()"
    />
    
    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading-center" />
    
    <!-- 好友信息 -->
    <div v-else-if="friend" class="friend-content">
      <!-- 基本信息卡片 -->
      <div class="friend-card">
        <div class="friend-header">
          <div class="friend-avatar">
            <van-image
              :src="friend.avatar"
              round
              width="80"
              height="80"
            />
            <div 
              class="status-dot"
              :class="friend.status"
            />
          </div>
          <div class="friend-info">
            <h2 class="friend-name">{{ friend.name }}</h2>
            <div class="friend-meta">
              <span class="friend-gender">{{ friend.gender }}</span>
              <span class="friend-age">{{ friend.age }}岁</span>
              <span class="friend-level">{{ friend.level }}</span>
            </div>
            <div class="friend-location">
              <van-icon name="location-o" />
              {{ friend.location }}
            </div>
            <div class="friend-active">{{ friend.lastActive }}</div>
          </div>
        </div>
        
        <!-- 运动标签 -->
        <div class="friend-sports">
          <van-tag
            v-for="sport in friend.sports"
            :key="sport"
            type="primary"
            plain
            size="medium"
          >
            {{ sport }}
          </van-tag>
        </div>
        
        <!-- 操作按钮 -->
        <div class="friend-actions">
          <van-button
            v-if="!friend.isFriend"
            type="primary"
            size="large"
            block
            @click="addFriend"
          >
            添加好友
          </van-button>
          <div v-else class="action-buttons">
            <van-button
              type="primary"
              size="large"
              @click="sendMessage"
            >
              发消息
            </van-button>
            <van-button
              type="default"
              size="large"
              @click="showToast('邀请运动')"
            >
              邀请运动
            </van-button>
          </div>
        </div>
      </div>
      
      <!-- 统计信息 -->
      <van-cell-group title="运动数据">
        <van-cell title="参与活动" :value="`${friend.stats.activities} 次`" />
        <van-cell title="运动好友" :value="`${friend.stats.friends} 人`" />
        <van-cell title="好评率" :value="`${friend.stats.rating} 分`">
          <template #right-icon>
            <van-rate v-model="friend.stats.rating" readonly size="12" />
          </template>
        </van-cell>
      </van-cell-group>
      
      <!-- 个人介绍 -->
      <van-cell-group title="个人介绍">
        <van-cell>
          <div class="friend-introduction">{{ friend.introduction }}</div>
        </van-cell>
      </van-cell-group>
      
      <!-- 运动经验 -->
      <van-cell-group title="运动经验">
        <van-cell>
          <div class="friend-experience">{{ friend.experience }}</div>
        </van-cell>
      </van-cell-group>
      
      <!-- 运动成就 -->
      <van-cell-group title="运动成就" v-if="friend.achievements.length > 0">
        <van-cell
          v-for="(achievement, index) in friend.achievements"
          :key="index"
        >
          <template #icon>
            <van-icon name="medal-o" color="#ffd700" />
          </template>
          <div class="achievement-text">{{ achievement }}</div>
        </van-cell>
      </van-cell-group>
      
      <!-- 最近活动 -->
      <van-cell-group title="最近活动" v-if="friend.recentActivities.length > 0">
        <van-cell
          v-for="activity in friend.recentActivities"
          :key="activity.id"
          :title="activity.title"
          :label="activity.date"
          is-link
          @click="viewActivity(activity)"
        >
          <template #icon>
            <van-tag type="primary" plain size="mini">
              {{ activity.sport }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { requireAuth } from '../utils/authGuard.js'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 页面状态
const loading = ref(false)
const friend = ref(null)

// 模拟好友数据
const mockFriend = {
  id: route.params.id,
  name: '篮球达人',
  avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
  phone: '138****8000',
  gender: '男',
  age: 25,
  location: '北京市朝阳区',
  sports: ['篮球', '足球', '羽毛球'],
  level: '高级',
  experience: '5年运动经验',
  introduction: '热爱运动，擅长篮球和足球。希望能结识更多运动伙伴，一起享受运动的快乐！',
  achievements: [
    '2023年朝阳区篮球联赛冠军',
    '北京市业余足球联赛亚军',
    '羽毛球三级运动员'
  ],
  stats: {
    activities: 156,
    friends: 89,
    rating: 4.8
  },
  recentActivities: [
    {
      id: 1,
      title: '朝阳公园篮球约战',
      date: '2024-01-20',
      sport: '篮球'
    },
    {
      id: 2,
      title: '奥森跑步团',
      date: '2024-01-18',
      sport: '跑步'
    }
  ],
  status: 'online',
  lastActive: '刚刚',
  isFriend: false
}

// 加载好友详情
const loadFriendDetail = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    friend.value = mockFriend
  } catch (error) {
    showToast('加载好友信息失败')
  } finally {
    loading.value = false
  }
}

// 添加好友
const addFriend = async () => {
  const isAuth = await requireAuth({
    message: '添加好友需要登录',
    router,
    onSuccess: async () => {
      try {
        await showConfirmDialog({
          title: '添加好友',
          message: `确定要添加 ${friend.value.name} 为好友吗？`,
        })
        // 模拟添加好友API
        await new Promise(resolve => setTimeout(resolve, 1000))
        friend.value.isFriend = true
        showToast('好友申请已发送')
      } catch (error) {
        if (error !== 'cancel') {
          showToast('添加好友失败')
        }
      }
    }
  })
}

// 发送消息
const sendMessage = async () => {
  const isAuth = await requireAuth({
    message: '发送消息需要登录',
    router,
    onSuccess: () => {
      showToast(`向 ${friend.value.name} 发送消息`)
      // 这里可以跳转到聊天页面
    }
  })
}

// 查看活动详情
const viewActivity = (activity) => {
  router.push(`/activity/${activity.id}`)
}

// 页面初始化
onMounted(async () => {
  const isAuth = await requireAuth({
    message: '查看好友详情需要登录',
    router,
    onSuccess: () => {
      loadFriendDetail()
    },
    onFail: () => {
      router.back()
    }
  })
})
</script>

<style lang="scss" scoped>
.friend-detail {
  min-height: 100vh;
  background: #f7f8fa;
}

.loading-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.friend-content {
  padding: 16px;
}

.friend-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  .friend-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
    
    .friend-avatar {
      position: relative;
      margin-right: 16px;
      
      .status-dot {
        position: absolute;
        bottom: 4px;
        right: 4px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 3px solid #fff;
        
        &.online {
          background: #07c160;
        }
        
        &.offline {
          background: #969799;
        }
      }
    }
    
    .friend-info {
      flex: 1;
      
      .friend-name {
        margin: 0 0 8px 0;
        font-size: 20px;
        font-weight: 600;
        color: #323233;
      }
      
      .friend-meta {
        display: flex;
        gap: 12px;
        margin-bottom: 8px;
        font-size: 14px;
        color: #646566;
        
        .friend-level {
          color: #1989fa;
          font-weight: 500;
        }
      }
      
      .friend-location {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 14px;
        color: #969799;
        margin-bottom: 4px;
      }
      
      .friend-active {
        font-size: 12px;
        color: #969799;
      }
    }
  }
  
  .friend-sports {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
  
  .friend-actions {
    .action-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
  }
}

.van-cell-group {
  margin-bottom: 16px;
}

.friend-introduction,
.friend-experience {
  line-height: 1.6;
  color: #646566;
}

.achievement-text {
  color: #646566;
  line-height: 1.5;
}
</style>