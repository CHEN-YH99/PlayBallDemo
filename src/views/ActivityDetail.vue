<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { requireAuth } from '../utils/authGuard.js'
import { showToast, showConfirmDialog } from 'vant'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 页面状态
const loading = ref(false)
const activity = ref(null)
const participants = ref([])
const showContactDialog = ref(false)

// 模拟活动数据
const mockActivity = {
  id: route.params.id,
  title: '朝阳公园篮球约战',
  sport: '篮球',
  organizer: '篮球达人',
  organizerAvatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
  date: '2024-01-20',
  time: '19:00',
  duration: 120,
  location: '北京市朝阳区朝阳公园篮球场',
  maxParticipants: 10,
  currentParticipants: 6,
  fee: 20,
  level: '中级',
  description: '欢迎各位篮球爱好者参加！我们将进行3v3比赛，提供篮球和饮用水。请大家准时到达，带好运动装备。',
  equipment: '自备运动鞋，提供篮球',
  rules: '友谊第一，比赛第二。禁止恶意犯规。',
  contact: '13800138000',
  images: [
    'https://img.yzcdn.cn/vant/apple-1.jpg',
    'https://img.yzcdn.cn/vant/apple-2.jpg'
  ],
  status: 'active', // active, full, cancelled, finished
  createdAt: '2024-01-15T10:00:00Z',
  tags: ['篮球', '3v3', '朝阳公园']
}

// 模拟参与者数据
const mockParticipants = [
  {
    id: 1,
    name: '足球小子',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    level: '高级',
    joinedAt: '2024-01-16T14:30:00Z'
  },
  {
    id: 2,
    name: '羽球高手',
    avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
    level: '中级',
    joinedAt: '2024-01-17T09:15:00Z'
  }
]

// 计算属性
const canJoin = computed(() => {
  if (!activity.value) return false
  return activity.value.status === 'active' && 
         activity.value.currentParticipants < activity.value.maxParticipants
})

const isOrganizer = computed(() => {
  return userStore.currentUser?.name === activity.value?.organizer
})

const hasJoined = computed(() => {
  if (!userStore.currentUser) return false
  return participants.value.some(p => p.id === userStore.currentUser.id)
})

// 加载活动详情
const loadActivityDetail = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    activity.value = mockActivity
    participants.value = mockParticipants
  } catch (error) {
    showToast('加载活动详情失败')
  } finally {
    loading.value = false
  }
}

// 报名参加活动
const joinActivity = async () => {
  const isAuth = await requireAuth({
    message: '报名参加活动需要登录',
    router,
    onSuccess: async () => {
      if (hasJoined.value) {
        showToast('您已经报名了此活动')
        return
      }
      
      if (!canJoin.value) {
        showToast('活动已满员或已结束')
        return
      }
      
      try {
        await showConfirmDialog({
          title: '确认报名',
          message: `确定要报名参加"${activity.value.title}"吗？`,
        })
        
        // 模拟报名API
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 更新参与者列表
        participants.value.push({
          id: userStore.currentUser.id,
          name: userStore.currentUser.nickname || userStore.currentUser.phone,
          avatar: userStore.currentUser.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg',
          level: '中级',
          joinedAt: new Date().toISOString()
        })
        
        // 更新活动参与人数
        activity.value.currentParticipants += 1
        showToast('报名成功！')
      } catch (error) {
        if (error !== 'cancel') {
          showToast('报名失败，请重试')
        }
      }
    }
  })
}

// 取消报名
const cancelJoin = async () => {
  try {
    await showConfirmDialog({
      title: '确认取消',
      message: '确定要取消报名吗？',
    })
    
    // 模拟取消报名API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 从参与者列表中移除
    const index = participants.value.findIndex(p => p.id === userStore.currentUser.id)
    if (index > -1) {
      participants.value.splice(index, 1)
      activity.value.currentParticipants -= 1
    }
    
    showToast('已取消报名')
  } catch (error) {
    if (error !== 'cancel') {
      showToast('取消报名失败')
    }
  }
}

// 联系组织者
const contactOrganizer = async () => {
  const isAuth = await requireAuth({
    message: '联系组织者需要登录',
    router,
    onSuccess: () => {
      showContactDialog.value = true
    }
  })
}

// 分享活动
const shareActivity = () => {
  if (navigator.share) {
    navigator.share({
      title: activity.value.title,
      text: activity.value.description,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast('链接已复制到剪贴板')
    })
  }
}

// 格式化时间
const formatDateTime = (date, time) => {
  const dateObj = new Date(`${date}T${time}`)
  return dateObj.toLocaleString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 页面初始化
onMounted(async () => {
  const isAuth = await requireAuth({
    message: '查看活动详情需要登录',
    router,
    onSuccess: () => {
      loadActivityDetail()
    },
    onFail: () => {
      router.back()
    }
  })
})
</script>

<template>
  <div class="activity-detail">
    <!-- 头部导航 -->
    <van-nav-bar
      title="活动详情"
      left-arrow
      @click-left="router.back()"
    >
      <template #right>
        <van-icon name="share-o" @click="shareActivity" />
      </template>
    </van-nav-bar>
    
    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading-center" />
    
    <!-- 活动内容 -->
    <div v-else-if="activity" class="activity-content">
      <!-- 活动图片 -->
      <van-swipe v-if="activity.images.length > 0" class="activity-images">
        <van-swipe-item v-for="image in activity.images" :key="image">
          <van-image :src="image" fit="cover" />
        </van-swipe-item>
      </van-swipe>
      
      <!-- 活动信息 -->
      <div class="activity-info">
        <!-- 标题和状态 -->
        <div class="activity-header">
          <h1 class="activity-title">{{ activity.title }}</h1>
          <van-tag 
            :type="activity.status === 'active' ? 'primary' : 'default'"
            size="large"
          >
            {{ activity.status === 'active' ? '进行中' : '已结束' }}
          </van-tag>
        </div>
        
        <!-- 基本信息 -->
        <van-cell-group>
          <van-cell title="运动类型" :value="activity.sport" />
          <van-cell title="活动时间" :value="formatDateTime(activity.date, activity.time)" />
          <van-cell title="持续时间" :value="`${activity.duration}分钟`" />
          <van-cell title="活动地点" :value="activity.location" />
          <van-cell title="水平要求" :value="activity.level" />
          <van-cell title="活动费用" :value="activity.fee > 0 ? `${activity.fee}元` : '免费'" />
          <van-cell 
            title="参与人数" 
            :value="`${activity.currentParticipants}/${activity.maxParticipants}`"
          />
        </van-cell-group>
        
        <!-- 组织者信息 -->
        <van-cell-group title="组织者">
          <van-cell>
            <template #icon>
              <van-image
                :src="activity.organizerAvatar"
                round
                width="40"
                height="40"
              />
            </template>
            <template #title>
              <span class="organizer-name">{{ activity.organizer }}</span>
            </template>
            <template #right-icon>
              <van-button
                size="small"
                type="primary"
                plain
                @click="contactOrganizer"
              >
                联系
              </van-button>
            </template>
          </van-cell>
        </van-cell-group>
        
        <!-- 活动描述 -->
        <van-cell-group title="活动描述">
          <van-cell>
            <div class="activity-description">{{ activity.description }}</div>
          </van-cell>
        </van-cell-group>
        
        <!-- 装备要求 -->
        <van-cell-group title="装备要求" v-if="activity.equipment">
          <van-cell>
            <div class="activity-equipment">{{ activity.equipment }}</div>
          </van-cell>
        </van-cell-group>
        
        <!-- 活动规则 -->
        <van-cell-group title="活动规则" v-if="activity.rules">
          <van-cell>
            <div class="activity-rules">{{ activity.rules }}</div>
          </van-cell>
        </van-cell-group>
        
        <!-- 参与者列表 -->
        <van-cell-group title="参与者">
          <van-cell
            v-for="participant in participants"
            :key="participant.id"
          >
            <template #icon>
              <van-image
                :src="participant.avatar"
                round
                width="32"
                height="32"
              />
            </template>
            <template #title>
              {{ participant.name }}
            </template>
            <template #label>
              {{ participant.level }}
            </template>
          </van-cell>
          <van-empty
            v-if="participants.length === 0"
            image="search"
            description="暂无参与者"
          />
        </van-cell-group>
        
        <!-- 标签 -->
        <div class="activity-tags" v-if="activity.tags.length > 0">
          <van-tag
            v-for="tag in activity.tags"
            :key="tag"
            type="primary"
            plain
            size="medium"
          >
            {{ tag }}
          </van-tag>
        </div>
      </div>
    </div>
    
    <!-- 底部操作栏 -->
    <div class="activity-actions" v-if="activity">
      <template v-if="isOrganizer">
        <van-button type="warning" size="large" block>
          管理活动
        </van-button>
      </template>
      <template v-else-if="hasJoined">
        <van-button type="danger" size="large" block @click="cancelJoin">
          取消报名
        </van-button>
      </template>
      <template v-else>
        <van-button 
          type="primary" 
          size="large" 
          block
          :disabled="!canJoin"
          @click="joinActivity"
        >
          {{ canJoin ? '立即报名' : '活动已满' }}
        </van-button>
      </template>
    </div>
    
    <!-- 联系组织者对话框 -->
    <van-dialog
      v-model:show="showContactDialog"
      title="联系组织者"
      :message="`组织者：${activity?.organizer}\n联系方式：${activity?.contact}`"
      show-cancel-button
      confirm-button-text="拨打电话"
      @confirm="() => window.open(`tel:${activity.contact}`)"
    />
  </div>
</template>

<style lang="scss" scoped>
.activity-detail {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
}

.loading-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.activity-images {
  height: 200px;
  
  .van-image {
    width: 100%;
    height: 100%;
  }
}

.activity-content {
  .activity-info {
    padding: 16px;
    
    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      
      .activity-title {
        flex: 1;
        margin: 0 16px 0 0;
        font-size: 20px;
        font-weight: 600;
        color: #323233;
        line-height: 1.4;
      }
    }
    
    .van-cell-group {
      margin-bottom: 16px;
    }
    
    .organizer-name {
      font-weight: 500;
      color: #323233;
    }
    
    .activity-description,
    .activity-equipment,
    .activity-rules {
      line-height: 1.6;
      color: #646566;
      white-space: pre-wrap;
    }
    
    .activity-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 16px;
    }
  }
}

.activity-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #ebedf0;
  z-index: 100;
}
</style>