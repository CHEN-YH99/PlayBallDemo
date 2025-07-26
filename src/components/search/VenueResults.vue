<template>
  <div class="venue-results">
    <div v-if="venues.length === 0" class="empty-results">
      <van-empty description="没有找到相关场地" />
    </div>
    
    <div v-else class="venue-list">
      <div 
        v-for="venue in processedVenues" 
        :key="venue.id"
        class="venue-card"
        @click="handleVenueClick(venue)"
      >
        <div class="venue-header">
          <h3 class="venue-name">{{ venue.name }}</h3>
          <van-rate 
            v-model="venue.rating" 
            :size="16" 
            color="#ffd21e" 
            void-icon="star" 
            void-color="#eee"
            readonly
          />
        </div>
        
        <div class="venue-info">
          <div class="info-row">
            <van-icon name="location-o" />
            <span>{{ venue.address }}</span>
          </div>
          
          <div class="info-row">
            <van-icon name="shop-o" />
            <span>{{ venue.city }} {{ venue.district }}</span>
          </div>
          
          <div class="info-row">
            <van-icon name="gold-coin-o" />
            <span>{{ venue.price || '价格面议' }}</span>
          </div>
        </div>
        
        <div class="venue-sports">
          <span class="sports-label">支持运动:</span>
          <van-tag 
            v-for="sport in venue.sports" 
            :key="sport"
            :type="getSportType(sport)" 
            size="small"
          >
            {{ sport }}
          </van-tag>
        </div>
        
        <div class="venue-actions">
          <van-button 
            type="primary" 
            size="small" 
            plain
            @click.stop="handleContact(venue)"
          >
            联系场地
          </van-button>
          <van-button 
            type="default" 
            size="small"
            @click.stop="handleViewDetails(venue)"
          >
            查看详情
          </van-button>
          <van-button 
            type="success" 
            size="small"
            @click.stop="handleBooking(venue)"
          >
            预订场地
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { showToast } from 'vant'

const props = defineProps({
  venues: {
    type: Array,
    default: () => []
  }
})

// 为每个场地添加默认评分和价格
const processedVenues = computed(() => {
  return props.venues.map(venue => ({
    ...venue,
    rating: venue.rating || (3.5 + Math.random() * 1.5), // 3.5-5.0 随机评分
    price: venue.price || generateRandomPrice(venue.sports)
  }))
})

// 生成随机价格
const generateRandomPrice = (sports) => {
  const basePrices = {
    '篮球': 50,
    '足球': 80,
    '羽毛球': 40,
    '网球': 60,
    '乒乓球': 30,
    '台球': 25,
    '排球': 45
  }
  
  const sport = sports[0] || '篮球'
  const basePrice = basePrices[sport] || 50
  const variation = Math.floor(Math.random() * 20) - 10 // -10 到 +10 的变化
  
  return `${basePrice + variation}元/小时`
}

// 获取运动类型样式
const getSportType = (sport) => {
  const typeMap = {
    '篮球': 'primary',
    '足球': 'success',
    '羽毛球': 'warning',
    '网球': 'danger',
    '乒乓球': 'default',
    '台球': 'primary',
    '排球': 'success'
  }
  return typeMap[sport] || 'default'
}

// 事件处理
const handleVenueClick = (venue) => {
  showToast(`查看场地: ${venue.name}`)
}

const handleContact = (venue) => {
  showToast(`联系场地: ${venue.name}`)
}

const handleViewDetails = (venue) => {
  showToast(`查看场地详情: ${venue.name}`)
}

const handleBooking = (venue) => {
  showToast(`预订场地: ${venue.name}`)
}
</script>

<style lang="scss" scoped>
.venue-results {
  padding: 16px;
}

.empty-results {
  background: #fff;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
}

.venue-list {
  .venue-card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
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

    .venue-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .venue-name {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #323233;
        flex: 1;
        margin-right: 12px;
      }
    }

    .venue-info {
      margin-bottom: 12px;

      .info-row {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
        color: #646566;

        &:last-child {
          margin-bottom: 0;
        }

        .van-icon {
          margin-right: 8px;
          font-size: 14px;
          color: #969799;
        }
      }
    }

    .venue-sports {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;

      .sports-label {
        font-size: 14px;
        color: #646566;
        margin-right: 4px;
      }
    }

    .venue-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  }
}

@media (max-width: 768px) {
  .venue-list {
    .venue-card {
      .venue-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .venue-actions {
        justify-content: center;
        
        .van-button {
          flex: 1;
          min-width: 80px;
        }
      }
    }
  }
}
</style>