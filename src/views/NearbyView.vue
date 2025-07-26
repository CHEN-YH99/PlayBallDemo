<template>
  <div class="nearby-view">
    <div class="page-header">
      <h1>附近球友和活动</h1>
      <p>选择你的位置，找到附近的球友和活动</p>
    </div>
    
    <!-- 位置选择器 -->
    <LocationSelector />
    
    <!-- 数据展示区域 -->
    <div v-if="nearbyStore.hasData" class="data-section">
      <!-- 统计信息 -->
      <div class="stats-card">
        <div class="stat-item">
          <span class="stat-number">{{ nearbyStore.totalPlayers }}</span>
          <span class="stat-label">球友</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ nearbyStore.totalActivities }}</span>
          <span class="stat-label">活动</span>
        </div>
      </div>
      
      <!-- 切换标签 -->
      <van-tabs v-model:active="activeTab" sticky>
        <van-tab title="球友列表" name="players">
          <PlayerList />
        </van-tab>
        <van-tab title="活动列表" name="activities">
          <ActivityList />
        </van-tab>
      </van-tabs>
    </div>
    
    <!-- 空状态提示 -->
    <div v-else-if="!nearbyStore.loading && nearbyStore.selectedCity" class="empty-state">
      <van-empty 
        description="该地区暂无球友和活动数据"
        image="search"
      >
        <van-button 
          type="primary" 
          size="small"
          @click="nearbyStore.fetchNearbyData"
        >
          重新搜索
        </van-button>
      </van-empty>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNearbyStore } from '@/stores/nearby'
import LocationSelector from '@/components/LocationSelector.vue'
import PlayerList from '@/components/PlayerList.vue'
import ActivityList from '@/components/ActivityList.vue'

const nearbyStore = useNearbyStore()
const activeTab = ref('players')
</script>

<style scoped>
.nearby-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 16px;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px 0;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.data-section {
  margin-top: 16px;
}

.stats-card {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 28px;
  font-weight: 600;
  color: #1989fa;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-divider {
  width: 1px;
  background: #f0f0f0;
  margin: 0 20px;
}

.empty-state {
  margin-top: 40px;
  background: white;
  border-radius: 8px;
  padding: 40px 20px;
}
</style>