<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'
import { usePublishStore } from '../stores/publishStore.js'
import { useUserStore } from '../stores/user.js'
import { useLocationStore } from '../stores/locationStore.js'

const router = useRouter()
const publishStore = usePublishStore()
const userStore = useUserStore()
const locationStore = useLocationStore()

// 页面状态
const activeTab = ref('publish')
const showLocationPicker = ref(false)
const showSportPicker = ref(false)
const showLevelPicker = ref(false)

// 运动类型选项
const sportOptions = [
  { text: '篮球', value: 'basketball' },
  { text: '足球', value: 'football' },
  { text: '羽毛球', value: 'badminton' },
  { text: '网球', value: 'tennis' },
  { text: '乒乓球', value: 'pingpong' },
  { text: '游泳', value: 'swimming' },
  { text: '跑步', value: 'running' },
  { text: '健身', value: 'fitness' }
]

// 水平等级选项
const levelOptions = [
  { text: '不限水平', value: 'all' },
  { text: '新手', value: 'beginner' },
  { text: '中级', value: 'intermediate' },
  { text: '高级', value: 'advanced' }
]

// 发布类型标签
const publishTabs = [
  { key: 'activity', label: '发布活动', icon: 'calendar-o' },
  { key: 'moment', label: '发布动态', icon: 'photo-o' },
  { key: 'venue', label: '发布场地', icon: 'location-o' },
  { key: 'recruitment', label: '发布招募', icon: 'friends-o' }
]

// 计算属性
const currentLocation = computed(() => {
  const location = publishStore.publishData.location
  if (location.city && location.district) {
    return `${location.city} ${location.district}`
  }
  return '选择位置'
})

const selectedSport = computed(() => {
  const sport = publishStore.publishData.activity.sport
  const option = sportOptions.find(opt => opt.value === sport)
  return option ? option.text : '选择运动'
})

const selectedLevel = computed(() => {
  const level = publishStore.publishData.activity.level
  const option = levelOptions.find(opt => opt.value === level)
  return option ? option.text : '选择水平'
})

// 检查登录状态
const checkAuth = () => {
  if (!userStore.isAuthenticated) {
    showConfirmDialog({
      title: '需要登录',
      message: '发布内容需要先登录，是否前往登录？',
      confirmButtonText: '去登录',
      cancelButtonText: '取消'
    }).then(() => {
      router.push('/login')
    }).catch(() => {
      router.back()
    })
    return false
  }
  return true
}

// 处理发布类型切换
const handleTabChange = (type) => {
  publishStore.setPublishType(type)
}

// 处理位置选择
const handleLocationSelect = () => {
  const currentCity = locationStore.displayCity
  if (currentCity && currentCity !== '定位中...') {
    publishStore.setLocation({
      city: locationStore.city,
      district: locationStore.district || '',
      address: ''
    })
  }
  showLocationPicker.value = false
}

// 处理运动类型选择
const handleSportSelect = (sport) => {
  publishStore.publishData.activity.sport = sport.value
  showSportPicker.value = false
}

// 处理水平等级选择
const handleLevelSelect = (level) => {
  publishStore.publishData.activity.level = level.value
  showLevelPicker.value = false
}

// 处理图片上传
const handleImageUpload = (files) => {
  publishStore.uploadImages(files).catch(error => {
    showToast('图片上传失败')
  })
}

// 处理图片删除
const handleImageDelete = (imageId) => {
  publishStore.removeImage(imageId)
}

// 保存草稿
const handleSaveDraft = () => {
  try {
    publishStore.saveDraft()
    showToast('草稿已保存')
  } catch (error) {
    showToast('保存草稿失败')
  }
}

// 发布内容
const handlePublish = async () => {
  if (!checkAuth()) return

  try {
    await publishStore.publish()
    showToast('发布成功')
    router.back()
  } catch (error) {
    showToast(error.message || '发布失败')
  }
}

// 页面初始化
onMounted(() => {
  if (!checkAuth()) return
  
  publishStore.initialize()
  
  // 设置默认位置
  if (locationStore.city) {
    publishStore.setLocation({
      city: locationStore.city,
      district: locationStore.district || '',
      address: ''
    })
  }
})
</script>

<template>
  <div class="publish-view">
    <!-- 头部导航 -->
    <van-nav-bar
      title="发布内容"
      left-text="取消"
      right-text="草稿"
      left-arrow
      @click-left="router.back()"
      @click-right="handleSaveDraft"
    />

    <!-- 发布类型选择 -->
    <van-tabs 
      v-model:active="publishStore.publishData.type" 
      @change="handleTabChange"
      sticky
    >
      <van-tab 
        v-for="tab in publishTabs" 
        :key="tab.key"
        :name="tab.key"
        :title="tab.label"
      >
        <template #title>
          <van-icon :name="tab.icon" />
          {{ tab.label }}
        </template>
      </van-tab>
    </van-tabs>

    <!-- 发布内容 -->
    <div class="publish-content">
      <!-- 活动发布 -->
      <div v-if="publishStore.publishData.type === 'activity'" class="publish-form">
        <!-- 基本信息 -->
        <van-cell-group title="基本信息">
          <van-field
            v-model="publishStore.publishData.title"
            label="活动标题"
            placeholder="请输入活动标题"
            required
            maxlength="50"
            show-word-limit
          />
          
          <van-cell 
            title="运动类型" 
            :value="selectedSport"
            is-link
            required
            @click="showSportPicker = true"
          />
          
          <van-cell 
            title="活动位置" 
            :value="currentLocation"
            is-link
            required
            @click="showLocationPicker = true"
          />
          
          <van-field
            v-model="publishStore.publishData.location.address"
            label="详细地址"
            placeholder="请输入详细地址"
          />
        </van-cell-group>

        <!-- 时间设置 -->
        <van-cell-group title="时间设置">
          <van-field
            v-model="publishStore.publishData.activity.date"
            label="活动日期"
            placeholder="选择日期"
            type="date"
            required
          />
          
          <van-field
            v-model="publishStore.publishData.activity.time"
            label="开始时间"
            placeholder="选择时间"
            type="time"
            required
          />
          
          <van-field
            v-model.number="publishStore.publishData.activity.duration"
            label="持续时间"
            placeholder="分钟"
            type="number"
            suffix="分钟"
          />
        </van-cell-group>

        <!-- 参与设置 -->
        <van-cell-group title="参与设置">
          <van-field
            v-model.number="publishStore.publishData.activity.maxParticipants"
            label="最大人数"
            placeholder="请输入最大参与人数"
            type="number"
            required
          />
          
          <van-cell 
            title="水平要求" 
            :value="selectedLevel"
            is-link
            @click="showLevelPicker = true"
          />
          
          <van-field
            v-model.number="publishStore.publishData.activity.fee"
            label="活动费用"
            placeholder="0"
            type="number"
            suffix="元"
          />
        </van-cell-group>

        <!-- 详细描述 -->
        <van-cell-group title="详细描述">
          <van-field
            v-model="publishStore.publishData.content"
            type="textarea"
            placeholder="请描述活动详情、注意事项等"
            rows="4"
            maxlength="500"
            show-word-limit
            required
          />
          
          <van-field
            v-model="publishStore.publishData.activity.equipment"
            label="装备要求"
            placeholder="请说明需要携带的装备"
          />
          
          <van-field
            v-model="publishStore.publishData.activity.rules"
            label="活动规则"
            placeholder="请说明活动规则"
          />
        </van-cell-group>
      </div>

      <!-- 动态发布 -->
      <div v-else-if="publishStore.publishData.type === 'moment'" class="publish-form">
        <van-cell-group>
          <van-field
            v-model="publishStore.publishData.content"
            type="textarea"
            placeholder="分享你的运动时刻..."
            rows="6"
            maxlength="500"
            show-word-limit
            required
          />
        </van-cell-group>
      </div>

      <!-- 场地发布 -->
      <div v-else-if="publishStore.publishData.type === 'venue'" class="publish-form">
        <van-cell-group title="场地信息">
          <van-field
            v-model="publishStore.publishData.title"
            label="场地名称"
            placeholder="请输入场地名称"
            required
          />
          
          <van-field
            v-model="publishStore.publishData.venue.name"
            label="场地全称"
            placeholder="请输入场地完整名称"
            required
          />
          
          <van-cell 
            title="场地位置" 
            :value="currentLocation"
            is-link
            required
            @click="showLocationPicker = true"
          />
          
          <van-field
            v-model="publishStore.publishData.location.address"
            label="详细地址"
            placeholder="请输入详细地址"
            required
          />
        </van-cell-group>

        <van-cell-group title="场地详情">
          <van-field
            v-model="publishStore.publishData.content"
            type="textarea"
            placeholder="请描述场地设施、环境等"
            rows="4"
            required
          />
          
          <van-field
            v-model="publishStore.publishData.venue.openHours"
            label="开放时间"
            placeholder="如：9:00-22:00"
          />
          
          <van-field
            v-model="publishStore.publishData.venue.priceRange"
            label="价格范围"
            placeholder="如：50-100元/小时"
          />
          
          <van-field
            v-model="publishStore.publishData.venue.contact"
            label="联系方式"
            placeholder="请输入联系电话"
          />
        </van-cell-group>
      </div>

      <!-- 招募发布 -->
      <div v-else-if="publishStore.publishData.type === 'recruitment'" class="publish-form">
        <van-cell-group title="招募信息">
          <van-field
            v-model="publishStore.publishData.title"
            label="招募标题"
            placeholder="请输入招募标题"
            required
          />
          
          <van-field
            v-model="publishStore.publishData.recruitment.position"
            label="招募职位"
            placeholder="如：篮球教练、陪练等"
            required
          />
        </van-cell-group>

        <van-cell-group title="详细要求">
          <van-field
            v-model="publishStore.publishData.content"
            type="textarea"
            placeholder="请详细描述招募要求"
            rows="4"
            required
          />
          
          <van-field
            v-model="publishStore.publishData.recruitment.requirements"
            label="任职要求"
            placeholder="请输入任职要求"
          />
          
          <van-field
            v-model="publishStore.publishData.recruitment.salary"
            label="薪资待遇"
            placeholder="请输入薪资范围"
          />
          
          <van-field
            v-model="publishStore.publishData.recruitment.contact"
            label="联系方式"
            placeholder="请输入联系方式"
          />
        </van-cell-group>
      </div>

      <!-- 图片上传 -->
      <van-cell-group title="图片" v-if="publishStore.publishData.type !== 'recruitment'">
        <van-uploader
          v-model="publishStore.publishData.images"
          multiple
          :max-count="9"
          :after-read="handleImageUpload"
          :delete-icon="true"
          @delete="handleImageDelete"
        />
      </van-cell-group>
    </div>

    <!-- 发布按钮 -->
    <div class="publish-footer">
      <van-button 
        type="primary" 
        size="large" 
        block
        :loading="publishStore.isPublishing"
        :disabled="!publishStore.canPublish"
        @click="handlePublish"
      >
        {{ publishStore.publishButtonText }}
      </van-button>
    </div>

    <!-- 位置选择弹窗 -->
    <van-popup v-model:show="showLocationPicker" position="bottom" round>
      <div class="picker-container">
        <van-nav-bar
          title="选择位置"
          left-text="取消"
          right-text="确定"
          @click-left="showLocationPicker = false"
          @click-right="handleLocationSelect"
        />
        <div class="location-info">
          <p>当前位置：{{ locationStore.displayCity }}</p>
          <p class="tip">将使用当前定位作为发布位置</p>
        </div>
      </div>
    </van-popup>

    <!-- 运动类型选择 -->
    <van-popup v-model:show="showSportPicker" position="bottom" round>
      <van-picker
        :columns="sportOptions"
        title="选择运动类型"
        @confirm="handleSportSelect"
        @cancel="showSportPicker = false"
      />
    </van-popup>

    <!-- 水平等级选择 -->
    <van-popup v-model:show="showLevelPicker" position="bottom" round>
      <van-picker
        :columns="levelOptions"
        title="选择水平要求"
        @confirm="handleLevelSelect"
        @cancel="showLevelPicker = false"
      />
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.publish-view {
  min-height: 100vh;
  background: #f7f8fa;
  padding-bottom: 80px;
}

.publish-content {
  padding: 16px;
}

.publish-form {
  .van-cell-group {
    margin-bottom: 16px;
  }
}

.publish-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  border-top: 1px solid #ebedf0;
  z-index: 100;
}

.picker-container {
  .location-info {
    padding: 20px;
    text-align: center;
    
    p {
      margin: 8px 0;
      color: #323233;
    }
    
    .tip {
      font-size: 14px;
      color: #969799;
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
</style>