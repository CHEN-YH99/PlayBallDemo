<template>
  <div class="activity-list">
    <div class="list-header">
      <h3>附近{{ currentSport.value }}活动 ({{ filteredActivities.length }})</h3>
    </div>
    
    <div v-if="nearbyStore.loading" class="loading-container">
      <van-loading size="24px">加载中...</van-loading>
    </div>
    
    <div v-else-if="nearbyStore.activities.length === 0" class="empty-container">
      <van-empty description="暂无活动数据" />
    </div>
    
    <div v-else class="activities-container">
      <div 
        v-for="activity in filteredActivities" 
        :key="activity.id"
        class="activity-card"
      >
        <div class="activity-header">
          <h4 class="activity-title">{{ activity.title }}</h4>
          <van-tag 
            :type="getSportType(activity.sport)"
            size="small"
          >
            {{ activity.sport }}
          </van-tag>
        </div>
        
        <div class="activity-info">
          <div class="info-row">
            <van-icon name="location-o" />
            <span>{{ activity.city }} {{ activity.district }}</span>
          </div>
          
          <div class="info-row">
            <van-icon name="shop-o" />
            <span>{{ activity.location }}</span>
          </div>
          
          <div class="info-row">
            <van-icon name="clock-o" />
            <span>{{ formatDateTime(activity.date, activity.time) }}</span>
          </div>
          
          <div class="info-row">
            <van-icon name="friends-o" />
            <span>{{ activity.current_participants }}/{{ activity.participants_limit }}人</span>
            <van-tag 
              :type="getParticipantStatus(activity)"
              size="small"
              plain
            >
              {{ getParticipantStatusText(activity) }}
            </van-tag>
          </div>
          
          <div class="info-row">
            <van-icon name="star-o" />
            <span>水平要求: {{ activity.skill_level }}</span>
          </div>
        </div>
        
        <p class="activity-description">{{ activity.description }}</p>
        
        <div class="activity-footer">
          <div class="organizer-info">
            <span class="organizer-label">组织者:</span>
            <span class="organizer-name">{{ activity.organizer }}</span>
          </div>
          
          <div class="activity-actions">
            <van-button 
              size="small" 
              type="primary" 
              plain
              @click="showContact(activity)"
            >
              联系组织者
            </van-button>
            <van-button 
              size="small" 
              type="success"
              :disabled="isActivityFull(activity)"
              @click="joinActivity(activity)"
            >
              {{ isActivityFull(activity) ? '已满员' : '报名参加' }}
            </van-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 联系方式弹窗 -->
    <van-dialog
      v-model:show="showContactDialog"
      title="联系组织者"
      :message="contactMessage"
      show-cancel-button
      confirm-button-text="复制"
      @confirm="copyContact"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNearbyStore } from '@/stores/nearby'
import { useLocationStore } from '@/stores/locationStore'
import { requireAuth } from '@/utils/authGuard.js'
import { showToast, showConfirmDialog } from 'vant'

const route = useRoute()
const router = useRouter()
const nearbyStore = useNearbyStore()
const locationStore = useLocationStore()

// 运动类型映射
const sportMap = {
  basketball: '篮球',
  football: '足球',
  badminton: '羽毛球',
  tennis: '网球',
  pingpong: '乒乓球',
  billiards: '台球',
  volleyball: '排球'
}

// 根据路由获取当前运动类型
const getCurrentSport = () => {
  const path = route.path
  if (path.includes('basketball')) return '篮球'
  if (path.includes('football')) return '足球'
  if (path.includes('badminton')) return '羽毛球'
  if (path.includes('tennis')) return '网球'
  if (path.includes('pingpong')) return '乒乓球'
  if (path.includes('billiards')) return '台球'
  if (path.includes('volleyball')) return '排球'
  return '篮球' // 默认
}

// 当前运动类型
const currentSport = ref(getCurrentSport())

// 过滤后的活动列表
const filteredActivities = computed(() => {
  return nearbyStore.activities.filter(activity => 
    activity.sport === currentSport.value
  )
})

// 响应式数据
const showContactDialog = ref(false)
const contactMessage = ref('')
const currentContact = ref('')

// 初始化数据
onMounted(async () => {
  // 设置当前运动类型
  currentSport.value = getCurrentSport()
  
  // 如果locationStore有位置信息，使用它来设置nearbyStore
  if (locationStore.locationDetails.city) {
    nearbyStore.setSelectedCity(locationStore.locationDetails.city)
    if (locationStore.locationDetails.district) {
      nearbyStore.setSelectedDistrict(locationStore.locationDetails.district)
    }
    await nearbyStore.fetchNearbyData()
  } else if (locationStore.currentCity && locationStore.currentCity !== '定位中...') {
    // 使用当前城市信息
    const cityParts = locationStore.currentCity.split(' ')
    if (cityParts.length >= 2) {
      nearbyStore.setSelectedCity(cityParts[0])
      nearbyStore.setSelectedDistrict(cityParts[1])
    } else {
      nearbyStore.setSelectedCity(locationStore.currentCity)
      nearbyStore.setSelectedDistrict('')
    }
    await nearbyStore.fetchNearbyData()
  } else {
    // 使用默认位置
    nearbyStore.setSelectedCity('北京市')
    nearbyStore.setSelectedDistrict('朝阳区')
    await nearbyStore.fetchNearbyData()
  }
})

// 监听路由变化
watch(() => route.path, () => {
  currentSport.value = getCurrentSport()
})

// 监听位置变化 - 统一处理位置更新
const updateLocationAndReload = async (city, district) => {
  if (city && city !== '定位中...' && !city.includes('定位')) {
    nearbyStore.setSelectedCity(city);
    if (district) {
      nearbyStore.setSelectedDistrict(district);
    } else {
      nearbyStore.setSelectedDistrict('');
    }
    await nearbyStore.fetchNearbyData();
  }
};

// 监听位置详情变化
watch(() => locationStore.locationDetails, async (newLocation) => {
  if (newLocation.city) {
    await updateLocationAndReload(newLocation.city, newLocation.district);
  }
}, { deep: true });

// 监听显示城市变化
watch(() => locationStore.displayCity, async (newDisplayCity) => {
  if (newDisplayCity && newDisplayCity !== '定位中...' && !newDisplayCity.includes('定位')) {
    // 优先使用详细位置信息
    if (locationStore.locationDetails.city && locationStore.locationDetails.district) {
      await updateLocationAndReload(
        locationStore.locationDetails.city, 
        locationStore.locationDetails.district
      );
    } else {
      // 如果没有详细信息，尝试从显示城市中解析
      const cityParts = newDisplayCity.split(' ');
      if (cityParts.length >= 2) {
        await updateLocationAndReload(cityParts[0], cityParts[1]);
      } else {
        await updateLocationAndReload(newDisplayCity, '');
      }
    }
  }
});

// 方法
const getSportType = (sport) => {
  const typeMap = {
    '篮球': 'primary',
    '足球': 'success',
    '羽毛球': 'warning',
    '网球': 'danger',
    '乒乓球': 'default'
  }
  return typeMap[sport] || 'default'
}

const getParticipantStatus = (activity) => {
  const ratio = activity.current_participants / activity.participants_limit
  if (ratio >= 1) return 'danger'
  if (ratio >= 0.8) return 'warning'
  return 'success'
}

const getParticipantStatusText = (activity) => {
  const ratio = activity.current_participants / activity.participants_limit
  if (ratio >= 1) return '已满员'
  if (ratio >= 0.8) return '即将满员'
  return '可报名'
}

const isActivityFull = (activity) => {
  return activity.current_participants >= activity.participants_limit
}

const formatDateTime = (date, time) => {
  const dateObj = new Date(date)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[dateObj.getDay()]
  
  return `${date} (${weekday}) ${time}`
}

const showContact = async (activity) => {
  const isAuthenticated = await requireAuth({
    message: '查看联系方式需要登录',
    router,
    onSuccess: () => {
      contactMessage.value = `组织者 ${activity.organizer} 的联系方式：\n${activity.contact}`
      currentContact.value = activity.contact
      showContactDialog.value = true
    }
  })
}

const copyContact = async () => {
  try {
    await navigator.clipboard.writeText(currentContact.value)
    showToast('联系方式已复制到剪贴板')
  } catch (error) {
    showToast('复制失败，请手动复制')
  }
}

const joinActivity = async (activity) => {
  const isAuthenticated = await requireAuth({
    message: '报名参加活动需要登录',
    router,
    onSuccess: async () => {
      try {
        await showConfirmDialog({
          title: '确认报名',
          message: `确定要报名参加"${activity.title}"吗？`,
        })
        
        // 这里可以调用报名API
        showToast('报名成功！请联系组织者确认详情')
        
        // 可以在这里更新活动的参与人数
        activity.current_participants += 1
      } catch (error) {
        // 用户取消报名
      }
    }
  })
}
</script>

<style scoped>
.activity-list {
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
}

.list-header {
  padding: 16px 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.list-header h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
}

.loading-container,
.empty-container {
  padding: 40px 16px;
  text-align: center;
}

.activities-container {
  padding: 16px;
}

.activity-card {
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #fafafa;
}

.activity-card:last-child {
  margin-bottom: 0;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.activity-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}

.activity-info {
  margin-bottom: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  color: #666;
  font-size: 14px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.activity-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.organizer-info {
  font-size: 14px;
}

.organizer-label {
  color: #666;
}

.organizer-name {
  color: #333;
  font-weight: 500;
}

.activity-actions {
  display: flex;
  gap: 8px;
}
</style>