<template>
  <div class="activity-results">
    <div v-if="activities.length === 0" class="empty-results">
      <van-empty description="没有找到相关活动" />
    </div>
    
    <div v-else class="activity-list">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="activity-card"
        @click="handleActivityClick(activity)"
      >
        <div class="activity-header">
          <h3 class="activity-title">{{ activity.title }}</h3>
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
          
          <div class="info-row">
            <van-icon name="gold-coin-o" />
            <span>费用: {{ activity.fee }}</span>
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
              type="primary" 
              size="small" 
              plain
              @click.stop="handleContact(activity)"
            >
              联系组织者
            </van-button>
            <van-button 
              type="success" 
              size="small"
              :disabled="isActivityFull(activity)"
              @click.stop="handleJoin(activity)"
            >
              {{ isActivityFull(activity) ? '已满员' : '报名参加' }}
            </van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { showToast, showConfirmDialog } from 'vant'

const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})

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

// 获取参与状态
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

// 格式化日期时间
const formatDateTime = (date, time) => {
  const dateObj = new Date(date)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekday = weekdays[dateObj.getDay()]
  
  return `${date} (${weekday}) ${time}`
}

// 事件处理
const handleActivityClick = (activity) => {
  showToast(`查看活动: ${activity.title}`)
}

const handleContact = (activity) => {
  showToast(`联系组织者: ${activity.contact}`)
}

const handleJoin = async (activity) => {
  try {
    await showConfirmDialog({
      title: '确认报名',
      message: `确定要报名参加"${activity.title}"吗？`,
    })
    
    showToast('报名成功！请联系组织者确认详情')
  } catch (error) {
    // 用户取消报名
  }
}
</script>

<style lang="scss" scoped>
.activity-results {
  padding: 16px;
}

.empty-results {
  background: #fff;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
}

.activity-list {
  .activity-card {
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

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .activity-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #323233;
        flex: 1;
        margin-right: 12px;
      }
    }

    .activity-info {
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

        .van-tag {
          margin-left: 8px;
        }
      }
    }

    .activity-description {
      font-size: 14px;
      color: #646566;
      line-height: 1.4;
      margin: 0 0 16px 0;
      padding: 12px;
      background: #f7f8fa;
      border-radius: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .activity-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .organizer-info {
        font-size: 14px;

        .organizer-label {
          color: #646566;
        }

        .organizer-name {
          color: #323233;
          font-weight: 500;
          margin-left: 4px;
        }
      }

      .activity-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}

@media (max-width: 768px) {
  .activity-list {
    .activity-card {
      .activity-footer {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;

        .activity-actions {
          justify-content: center;
        }
      }
    }
  }
}
</style>