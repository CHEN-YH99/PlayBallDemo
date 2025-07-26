<template>
  <div class="player-results">
    <div v-if="players.length === 0" class="empty-results">
      <van-empty description="没有找到相关球友" />
    </div>
    
    <div v-else class="player-list">
      <div 
        v-for="player in players" 
        :key="player.id"
        class="player-card"
        @click="handlePlayerClick(player)"
      >
        <div class="player-avatar">
          <van-image 
            round 
            width="60" 
            height="60" 
            :src="player.avatar" 
            fit="cover" 
          />
          <van-icon 
            v-if="player.isOnline" 
            name="fire" 
            class="online-badge" 
            color="#FF976A" 
          />
        </div>
        
        <div class="player-info">
          <div class="player-header">
            <h3 class="player-name">{{ player.name }}</h3>
            <van-tag 
              :type="getSkillLevelType(player.skill_level)" 
              size="small"
            >
              {{ player.skill_level }}
            </van-tag>
          </div>
          
          <div class="player-details">
            <div class="detail-item">
              <van-icon name="location-o" />
              <span>{{ player.city }} {{ player.district }}</span>
            </div>
            
            <div class="detail-item">
              <van-icon name="user-o" />
              <span>{{ player.position }}</span>
            </div>
            
            <div class="detail-item">
              <van-icon name="calendar-o" />
              <span>{{ player.age }}岁</span>
            </div>
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
          
          <div class="player-actions">
            <van-button 
              type="primary" 
              size="small" 
              plain
              @click.stop="handleContact(player)"
            >
              联系
            </van-button>
            <van-button 
              type="default" 
              size="small" 
              @click.stop="handleViewProfile(player)"
            >
              查看资料
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const props = defineProps({
  players: {
    type: Array,
    default: () => []
  }
})

const router = useRouter()

// 获取技能等级类型
const getSkillLevelType = (level) => {
  const typeMap = {
    '初级': 'default',
    '中级': 'warning',
    '高级': 'danger'
  }
  return typeMap[level] || 'default'
}

// 事件处理
const handlePlayerClick = (player) => {
  router.push(`/friend/${player.id}`)
}

const handleContact = (player) => {
  showToast(`联系 ${player.name}: ${player.contact}`)
}

const handleViewProfile = (player) => {
  router.push(`/friend/${player.id}`)
}
</script>

<style lang="scss" scoped>
.player-results {
  padding: 16px;
}

.empty-results {
  background: #fff;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
}

.player-list {
  .player-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    display: flex;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    &:last-child {
      margin-bottom: 0;
    }

    .player-avatar {
      position: relative;
      margin-right: 16px;
      flex-shrink: 0;

      .online-badge {
        position: absolute;
        bottom: -2px;
        right: -2px;
        font-size: 20px;
        background: #fff;
        border-radius: 50%;
        padding: 2px;
      }
    }

    .player-info {
      flex: 1;
      min-width: 0;

      .player-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .player-name {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #323233;
        }
      }

      .player-details {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 8px;

        .detail-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #646566;

          .van-icon {
            margin-right: 4px;
            font-size: 14px;
          }
        }
      }

      .player-sports {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 8px;
      }

      .player-intro {
        font-size: 14px;
        color: #646566;
        line-height: 1.4;
        margin: 0 0 12px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .player-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}

@media (max-width: 768px) {
  .player-list {
    .player-card {
      .player-details {
        flex-direction: column;
        gap: 6px;
      }

      .player-actions {
        flex-direction: column;
        
        .van-button {
          width: 100%;
        }
      }
    }
  }
}
</style>