<template>
  <div class="location-selector">
    <div class="selector-header">
      <h3>选择位置</h3>
      <p class="current-location">当前位置: {{ nearbyStore.currentLocation }}</p>
    </div>
    
    <div class="selector-content">
      <!-- 城市选择 -->
      <div class="selector-group">
        <label>城市:</label>
        <van-field
          v-model="selectedCity"
          readonly
          is-link
          placeholder="请选择城市"
          @click="showCityPicker = true"
        />
      </div>
      
      <!-- 地区选择 -->
      <div class="selector-group" v-if="selectedCity">
        <label>地区 (可选):</label>
        <van-field
          v-model="selectedDistrict"
          readonly
          is-link
          placeholder="请选择地区"
          @click="showDistrictPicker = true"
        />
        <van-button 
          size="small" 
          type="default" 
          @click="clearDistrict"
          v-if="selectedDistrict"
        >
          清除地区
        </van-button>
      </div>
      
      <!-- 搜索按钮 -->
      <div class="search-actions">
        <van-button 
          type="primary" 
          block 
          :loading="nearbyStore.loading"
          @click="handleSearch"
          :disabled="!selectedCity"
        >
          搜索附近球友和活动
        </van-button>
      </div>
    </div>
    
    <!-- 城市选择器 -->
    <van-popup v-model:show="showCityPicker" position="bottom">
      <van-picker
        :columns="cityColumns"
        @confirm="onCityConfirm"
        @cancel="showCityPicker = false"
      />
    </van-popup>
    
    <!-- 地区选择器 -->
    <van-popup v-model:show="showDistrictPicker" position="bottom">
      <van-picker
        :columns="districtColumns"
        @confirm="onDistrictConfirm"
        @cancel="showDistrictPicker = false"
      />
    </van-popup>
    
    <!-- 错误提示 -->
    <van-notice-bar
      v-if="nearbyStore.error"
      type="danger"
      :text="nearbyStore.error"
      closeable
      @close="nearbyStore.clearError"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useNearbyStore } from '@/stores/nearby'

const nearbyStore = useNearbyStore()

// 响应式数据
const selectedCity = ref('')
const selectedDistrict = ref('')
const showCityPicker = ref(false)
const showDistrictPicker = ref(false)

// 计算属性
const cityColumns = computed(() => {
  return Object.keys(nearbyStore.cities).map(city => ({
    text: city,
    value: city
  }))
})

const districtColumns = computed(() => {
  if (!selectedCity.value) return []
  
  const districts = nearbyStore.currentCityDistricts
  return [
    { text: '全部地区', value: '' },
    ...districts.map(district => ({
      text: district,
      value: district
    }))
  ]
})

// 方法
const onCityConfirm = async ({ selectedOptions }) => {
  selectedCity.value = selectedOptions[0].value
  nearbyStore.setSelectedCity(selectedCity.value)
  selectedDistrict.value = '' // 重置地区选择
  showCityPicker.value = false
  
  // 选择城市后自动搜索
  await nearbyStore.fetchNearbyData()
}

const onDistrictConfirm = async ({ selectedOptions }) => {
  selectedDistrict.value = selectedOptions[0].value
  nearbyStore.setSelectedDistrict(selectedDistrict.value)
  showDistrictPicker.value = false
  
  // 选择地区后自动搜索
  await nearbyStore.fetchNearbyData()
}

const clearDistrict = async () => {
  selectedDistrict.value = ''
  nearbyStore.setSelectedDistrict('')
  
  // 清除地区后自动搜索
  await nearbyStore.fetchNearbyData()
}

const handleSearch = async () => {
  if (!selectedCity.value) {
    return
  }
  await nearbyStore.fetchNearbyData()
}

// 监听store中的选择变化
watch(() => nearbyStore.selectedCity, (newCity) => {
  selectedCity.value = newCity
})

watch(() => nearbyStore.selectedDistrict, (newDistrict) => {
  selectedDistrict.value = newDistrict
})

// 组件挂载时获取城市列表并设置默认位置
onMounted(async () => {
  await nearbyStore.fetchCities()
  
  // 设置默认位置为北京市朝阳区（如果还没有选择位置）
  if (!nearbyStore.selectedCity) {
    selectedCity.value = '北京市'
    selectedDistrict.value = '朝阳区'
    nearbyStore.setSelectedCity('北京市')
    nearbyStore.setSelectedDistrict('朝阳区')
    
    // 自动搜索默认位置的数据
    await nearbyStore.fetchNearbyData()
  }
})
</script>

<style scoped>
.location-selector {
  padding: 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 16px;
}

.selector-header {
  margin-bottom: 16px;
}

.selector-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
}

.current-location {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.selector-group {
  margin-bottom: 16px;
}

.selector-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.search-actions {
  margin-top: 20px;
}
</style>