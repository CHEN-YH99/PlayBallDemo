<template>
  <div class="player-list">
    <div class="list-header">
      <h3>附近球友 ({{ nearbyStore.totalPlayers }})</h3>
    </div>
    
    <div v-if="nearbyStore.loading" class="loading-container">
      <van-loading size="24px">加载中...</van-loading>
    </div>
    
    <div v-else-if="nearbyStore.players.length === 0" class="empty-container">
      <van-empty description="暂无球友数据" />
    </div>
    
    <div v-else class="players-container">
      <div 
        v-for="player in nearbyStore.players" 
        :key="player.id"
        class="player-card"
      >
        <div class="player-avatar">
          <van-image
            :src="player.avatar"
            width="60"
            height="60"
            round
            fit="cover"
          />
        </div>
        
        <div class="player-info">
          <div class="player-basic">
            <h4 class="player-name">{{ player.name }}</h4>
            <span class="player-age">{{ player.age }}岁</span>
            <van-tag 
              :type="getSkillLevelType(player.skill_level)"
              size="small"
            >
              {{ player.skill_level }}
            </van-tag>
          </div>
          
          <div class="player-location">
            <van-icon name="location-o" />
            <span>{{ player.city }} {{ player.district }}</span>
          </div>
          
          <div class="player-sports">
            <van-tag 
              v-for="sport in player.sports" 
              :key="sport"
              type="primary"
              size="small"
              plain
            >
              {{ sport }}
            </van-tag>
          </div>
          
          <p class="player-intro">{{ player.introduction }}</p>
          
          <div class="player-contact">
            <van-button 
              size="small" 
              type="primary" 
              plain
              @click="showContact(player)"
            >
              联系方式
            </van-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 联系方式弹窗 -->
    <van-dialog
      v-model:show="showContactDialog"
      title="联系方式"
      :message="contactMessage"
      show-cancel-button
      confirm-button-text="复制"
      @confirm="copyContact"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNearbyStore } from '@/stores/nearby'
import { showToast } from 'vant'

const nearbyStore = useNearbyStore()

// 响应式数据
const showContactDialog = ref(false)
const contactMessage = ref('')
const currentContact = ref('')

// 方法
const getSkillLevelType = (level) => {
  const typeMap = {
    '初级': 'success',
    '中级': 'warning', 
    '高级': 'danger'
  }
  return typeMap[level] || 'default'
}

const showContact = (player) => {
  contactMessage.value = `${player.name}的联系方式：\n${player.contact}`
  currentContact.value = player.contact
  showContactDialog.value = true
}

const copyContact = async () => {
  try {
    await navigator.clipboard.writeText(currentContact.value)
    showToast('联系方式已复制到剪贴板')
  } catch (error) {
    showToast('复制失败，请手动复制')
  }
}
</script>

<style scoped>
.player-list {
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

.players-container {
  padding: 16px;
}

.player-card {
  display: flex;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-bottom: 12px;
  background: #fafafa;
}

.player-card:last-child {
  margin-bottom: 0;
}

.player-avatar {
  margin-right: 16px;
  flex-shrink: 0;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-basic {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.player-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.player-age {
  color: #666;
  font-size: 14px;
}

.player-location {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.player-sports {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.player-intro {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.player-contact {
  display: flex;
  justify-content: flex-end;
}
</style>