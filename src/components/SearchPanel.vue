<template>
  <van-popup 
    v-model:show="searchStore.showSearchPanel" 
    position="top" 
    :style="{ height: '100vh' }"
    :overlay="false"
    :close-on-click-overlay="false"
  >
    <div class="search-panel">
      <!-- 搜索头部 -->
      <div class="search-header">
        <div class="search-input-container">
          <van-search
            v-model="searchStore.searchQuery"
            placeholder="搜索球友、活动、场地..."
            shape="round"
            :show-action="true"
            @search="handleSearch"
            @input="handleInput"
            @focus="handleFocus"
            @clear="handleClear"
            action-text="取消"
            @cancel="handleCancel"
          >
            <template #left-icon>
              <van-icon name="search" />
            </template>
          </van-search>
        </div>
      </div>

      <!-- 搜索内容区域 -->
      <div class="search-content">
        <!-- 搜索建议 -->
        <div v-if="showSuggestions" class="search-suggestions">
          <div class="suggestion-title">搜索建议</div>
          <div class="suggestion-list">
            <div 
              v-for="suggestion in searchStore.searchSuggestions" 
              :key="suggestion"
              class="suggestion-item"
              @click="selectSuggestion(suggestion)"
            >
              <van-icon name="search" class="suggestion-icon" />
              <span class="suggestion-text">{{ suggestion }}</span>
            </div>
          </div>
        </div>

        <!-- 搜索历史和热门搜索 -->
        <div v-if="showHistoryAndHot" class="search-default">
          <!-- 搜索历史 -->
          <div v-if="searchStore.searchHistory.length > 0" class="search-section">
            <div class="section-header">
              <span class="section-title">搜索历史</span>
              <van-button 
                type="default" 
                size="mini" 
                @click="searchStore.clearSearchHistory"
              >
                清空
              </van-button>
            </div>
            <div class="tag-list">
              <van-tag 
                v-for="item in searchStore.searchHistory" 
                :key="item"
                type="default"
                size="medium"
                closeable
                @click="selectHistoryItem(item)"
                @close="searchStore.removeFromHistory(item)"
              >
                {{ item }}
              </van-tag>
            </div>
          </div>

          <!-- 热门搜索 -->
          <div class="search-section">
            <div class="section-header">
              <span class="section-title">热门搜索</span>
            </div>
            <div class="tag-list">
              <van-tag 
                v-for="item in searchStore.hotSearches" 
                :key="item"
                type="primary"
                size="medium"
                @click="selectHotItem(item)"
              >
                {{ item }}
              </van-tag>
            </div>
          </div>
        </div>

        <!-- 搜索结果 -->
        <div v-if="showResults" class="search-results">
          <div class="results-header">
            <span class="results-count">找到 {{ searchStore.totalResultsCount }} 个结果</span>
          </div>

          <!-- 结果分类标签 -->
          <van-tabs v-model:active="activeTab" sticky>
            <van-tab 
              title="全部" 
              name="all"
              :badge="searchStore.totalResultsCount"
            >
              <div class="results-all">
                <!-- 球友结果 -->
                <div v-if="searchStore.searchResults.players.length > 0" class="result-section">
                  <div class="result-section-title">
                    <van-icon name="friends" />
                    <span>球友 ({{ searchStore.searchResults.players.length }})</span>
                  </div>
                  <div class="result-list">
                    <div 
                      v-for="player in searchStore.searchResults.players.slice(0, 3)" 
                      :key="player.id"
                      class="result-item player-item"
                      @click="handlePlayerClick(player)"
                    >
                      <van-image 
                        round 
                        width="40" 
                        height="40" 
                        :src="player.avatar" 
                        fit="cover" 
                      />
                      <div class="item-content">
                        <div class="item-title">{{ player.name }}</div>
                        <div class="item-subtitle">
                          {{ player.position }} · {{ player.city }} {{ player.district }}
                        </div>
                      </div>
                      <van-tag 
                        :type="player.isOnline ? 'success' : 'default'" 
                        size="small"
                      >
                        {{ player.isOnline ? '在线' : '离线' }}
                      </van-tag>
                    </div>
                  </div>
                  <div v-if="searchStore.searchResults.players.length > 3" class="view-more">
                    <van-button type="default" size="small" @click="viewMorePlayers">
                      查看更多球友 ({{ searchStore.searchResults.players.length - 3 }})
                    </van-button>
                  </div>
                </div>

                <!-- 活动结果 -->
                <div v-if="searchStore.searchResults.activities.length > 0" class="result-section">
                  <div class="result-section-title">
                    <van-icon name="calendar-o" />
                    <span>活动 ({{ searchStore.searchResults.activities.length }})</span>
                  </div>
                  <div class="result-list">
                    <div 
                      v-for="activity in searchStore.searchResults.activities.slice(0, 3)" 
                      :key="activity.id"
                      class="result-item activity-item"
                      @click="handleActivityClick(activity)"
                    >
                      <div class="item-content">
                        <div class="item-title">{{ activity.title }}</div>
                        <div class="item-subtitle">
                          {{ activity.location }} · {{ activity.date }} {{ activity.time }}
                        </div>
                        <div class="item-extra">
                          <van-tag type="primary" size="small">{{ activity.sport }}</van-tag>
                          <span class="participants">
                            {{ activity.current_participants }}/{{ activity.participants_limit }}人
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="searchStore.searchResults.activities.length > 3" class="view-more">
                    <van-button type="default" size="small" @click="viewMoreActivities">
                      查看更多活动 ({{ searchStore.searchResults.activities.length - 3 }})
                    </van-button>
                  </div>
                </div>

                <!-- 场地结果 -->
                <div v-if="searchStore.searchResults.venues.length > 0" class="result-section">
                  <div class="result-section-title">
                    <van-icon name="location" />
                    <span>场地 ({{ searchStore.searchResults.venues.length }})</span>
                  </div>
                  <div class="result-list">
                    <div 
                      v-for="venue in searchStore.searchResults.venues.slice(0, 3)" 
                      :key="venue.id"
                      class="result-item venue-item"
                      @click="handleVenueClick(venue)"
                    >
                      <div class="item-content">
                        <div class="item-title">{{ venue.name }}</div>
                        <div class="item-subtitle">{{ venue.address }}</div>
                        <div class="item-extra">
                          <van-tag 
                            v-for="sport in venue.sports" 
                            :key="sport" 
                            type="success" 
                            size="small"
                          >
                            {{ sport }}
                          </van-tag>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 无结果 -->
                <div v-if="searchStore.totalResultsCount === 0" class="no-results">
                  <van-empty description="没有找到相关结果">
                    <van-button type="primary" size="small" @click="handleClear">
                      重新搜索
                    </van-button>
                  </van-empty>
                </div>
              </div>
            </van-tab>

            <van-tab 
              title="球友" 
              name="players"
              :badge="searchStore.searchResults.players.length"
            >
              <PlayerResults :players="searchStore.searchResults.players" />
            </van-tab>

            <van-tab 
              title="活动" 
              name="activities"
              :badge="searchStore.searchResults.activities.length"
            >
              <ActivityResults :activities="searchStore.searchResults.activities" />
            </van-tab>

            <van-tab 
              title="场地" 
              name="venues"
              :badge="searchStore.searchResults.venues.length"
            >
              <VenueResults :venues="searchStore.searchResults.venues" />
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '../stores/searchStore.js'
import { showToast } from 'vant'
import PlayerResults from './search/PlayerResults.vue'
import ActivityResults from './search/ActivityResults.vue'
import VenueResults from './search/VenueResults.vue'

const router = useRouter()
const searchStore = useSearchStore()
const activeTab = ref('all')

// 计算属性
const showSuggestions = computed(() => 
  searchStore.hasSearchQuery && 
  searchStore.searchSuggestions.length > 0 && 
  !searchStore.hasSearchResults
)

const showHistoryAndHot = computed(() => 
  !searchStore.hasSearchQuery && 
  !searchStore.hasSearchResults
)

const showResults = computed(() => 
  searchStore.hasSearchQuery && 
  searchStore.hasSearchResults
)

// 防抖搜索
let searchTimeout = null

// 事件处理
const handleInput = (value) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    if (value && value.length >= 2) {
      searchStore.generateSuggestions(value)
    } else {
      searchStore.searchSuggestions = []
    }
  }, 300)
}

const handleSearch = (value) => {
  if (value.trim()) {
    searchStore.performSearch(value)
  }
}

const handleFocus = () => {
  // 聚焦时的处理
}

const handleClear = () => {
  searchStore.clearSearch()
}

const handleCancel = () => {
  searchStore.toggleSearchPanel(false)
  searchStore.clearSearch()
}

const selectSuggestion = (suggestion) => {
  searchStore.setSearchQuery(suggestion)
  searchStore.performSearch(suggestion)
}

const selectHistoryItem = (item) => {
  searchStore.setSearchQuery(item)
  searchStore.performSearch(item)
}

const selectHotItem = (item) => {
  searchStore.setSearchQuery(item)
  searchStore.performSearch(item)
}

// 结果点击处理
const handlePlayerClick = (player) => {
  showToast(`查看球友: ${player.name}`)
  // 这里可以跳转到球友详情页
  router.push(`/friend/${player.id}`)
}

const handleActivityClick = (activity) => {
  showToast(`查看活动: ${activity.title}`)
  // 这里可以跳转到活动详情页
}

const handleVenueClick = (venue) => {
  showToast(`查看场地: ${venue.name}`)
  // 这里可以跳转到场地详情页
}

const viewMorePlayers = () => {
  activeTab.value = 'players'
}

const viewMoreActivities = () => {
  activeTab.value = 'activities'
}

// 初始化
onMounted(() => {
  searchStore.initialize()
})
</script>

<style lang="scss" scoped>
.search-panel {
  height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.search-header {
  background: #fff;
  padding: 8px 16px;
  border-bottom: 1px solid #ebedf0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-input-container {
  .van-search {
    padding: 0;
    background: transparent;
  }
}

.search-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.search-suggestions {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;

  .suggestion-title {
    font-size: 14px;
    color: #646566;
    margin-bottom: 12px;
  }

  .suggestion-list {
    .suggestion-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f7f8fa;
      cursor: pointer;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: #f7f8fa;
      }

      .suggestion-icon {
        color: #969799;
        margin-right: 12px;
      }

      .suggestion-text {
        flex: 1;
        font-size: 14px;
        color: #323233;
      }
    }
  }
}

.search-default {
  .search-section {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #323233;
      }
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .van-tag {
        cursor: pointer;
      }
    }
  }
}

.search-results {
  .results-header {
    background: #fff;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;

    .results-count {
      font-size: 14px;
      color: #646566;
    }
  }

  .results-all {
    .result-section {
      background: #fff;
      border-radius: 8px;
      margin-bottom: 16px;
      overflow: hidden;

      .result-section-title {
        display: flex;
        align-items: center;
        padding: 16px;
        background: #f7f8fa;
        font-size: 16px;
        font-weight: 600;
        color: #323233;

        .van-icon {
          margin-right: 8px;
          color: #1989fa;
        }
      }

      .result-list {
        .result-item {
          display: flex;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #f7f8fa;
          cursor: pointer;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: #f7f8fa;
          }

          .item-content {
            flex: 1;
            margin-left: 12px;

            .item-title {
              font-size: 16px;
              font-weight: 600;
              color: #323233;
              margin-bottom: 4px;
            }

            .item-subtitle {
              font-size: 14px;
              color: #646566;
              margin-bottom: 4px;
            }

            .item-extra {
              display: flex;
              align-items: center;
              gap: 8px;

              .participants {
                font-size: 12px;
                color: #969799;
              }
            }
          }
        }

        .player-item {
          .van-image {
            flex-shrink: 0;
          }
        }

        .activity-item,
        .venue-item {
          .item-content {
            margin-left: 0;
          }
        }
      }

      .view-more {
        padding: 16px;
        text-align: center;
        border-top: 1px solid #f7f8fa;
      }
    }
  }

  .no-results {
    background: #fff;
    border-radius: 8px;
    padding: 40px 20px;
    text-align: center;
  }
}
</style>