<template>
  <div class="location-container">
    <van-nav-bar title="附近篮球场查询" left-arrow @click-left="goBack" fixed placeholder />

    <div class="content-wrapper">
      <div class="subtitle-section">
        <van-icon name="location-o" size="16" color="#666" />
        <span class="subtitle-text">查找并预订您附近的篮球场</span>
      </div>

      <van-tabs v-model:active="activeMode" @change="onModeChange">
        <van-tab title="地图模式" name="map">
          <template #title>
            <van-space :size="4">
              <van-icon name="location-o" size="16" />
              <span>地图模式</span>
            </van-space>
          </template>
        </van-tab>
        <van-tab title="列表模式" name="list">
          <template #title>
            <van-space :size="4">
              <van-icon name="bars" size="16" />
              <span>列表模式</span>
            </van-space>
          </template>
        </van-tab>
      </van-tabs>

      <div class="search-section">
        <van-search v-model="searchKeyword" placeholder="搜索球场名称或地址..." @search="onSearch" @clear="onClear" show-action>
          <template #action>
            <van-button type="primary" size="small" @click="onSearch">
              搜索
            </van-button>
          </template>
        </van-search>
      </div>

      <div class="filter-section">
        <van-dropdown-menu>
          <van-dropdown-item v-model="venueType" :options="venueTypeOptions" />
          <van-dropdown-item v-model="priceRange" :options="priceRangeOptions" />
        </van-dropdown-menu>
        <van-button type="primary" size="small" icon="filter-o" @click="showFilter = true" class="filter-btn">
          筛选
        </van-button>
      </div>

      <div class="venue-list-section">
        <van-cell-group>
          <van-cell>
            <template #title>
              <span class="list-title">附近球场 ({{ filteredVenues.length }})</span>
            </template>
            <template #right-icon>
              <van-dropdown-menu>
                <van-dropdown-item v-model="sortBy" :options="sortOptions" />
              </van-dropdown-menu>
            </template>
          </van-cell>
        </van-cell-group>

        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多场地了" @load="onLoad">
            <van-card v-for="venue in filteredVenues" :key="venue.id" :title="venue.name" :thumb="venue.image"
              @click="selectVenue(venue)" class="venue-card">
              <template #tags>
                <van-tag :type="getStatusType(venue.status)" size="small">
                  {{ getStatusText(venue.status) }}
                </van-tag>
              </template>

              <template #price>
                <span class="price">{{ venue.price }}元/小时</span>
              </template>

              <template #desc>
                <van-space direction="vertical" :size="8">
                  <van-space :size="8">
                    <van-rate v-model="venue.rating" size="12" readonly allow-half />
                    <span class="rating-text">{{ venue.rating }}</span>
                    <van-divider vertical />
                    <van-icon name="clock-o" size="12" />
                    <span class="time-text">{{ venue.availableTime }}</span>
                  </van-space>
                  <van-space :size="4">
                    <van-icon name="location-o" size="12" />
                    <span class="distance-text">{{ venue.distance }}km</span>
                  </van-space>
                </van-space>
              </template>

              <template #footer>
                <van-space :size="8">
                  <van-button type="primary" size="small" @click.stop="bookVenue(venue)">
                    立即预订
                  </van-button>
                  <van-button size="small" @click.stop="callVenue(venue)">
                    电话咨询
                  </van-button>
                </van-space>
              </template>
            </van-card>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>

    <!-- 地图弹窗 -->
    <van-popup v-model:show="showMap" position="top" :style="{ height: '70%' }" round>
      <div class="map-popup">
        <van-nav-bar title="场地地图" left-arrow @click-left="showMap = false" />

        <div class="map-venue-card">
          <van-card title="星光篮球馆" :thumb="'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'">
            <template #tags>
              <van-tag type="danger" size="small">繁忙</van-tag>
            </template>

            <template #price>
              <span class="price">150元/小时</span>
            </template>

            <template #desc>
              <van-space direction="vertical" :size="4">
                <van-space :size="8">
                  <van-rate v-model="mapVenueRating" size="12" readonly />
                  <span class="rating-text">4.9</span>
                  <van-divider vertical />
                  <van-icon name="clock-o" size="12" />
                  <span>明日09:00后有空场</span>
                </van-space>
                <van-space :size="4">
                  <van-icon name="location-o" size="12" />
                  <span>5.2km</span>
                </van-space>
              </van-space>
            </template>
          </van-card>
        </div>

        <div class="map-area">
          <div class="map-bg">
            <div v-for="(marker, index) in mapMarkers" :key="index" :class="['venue-marker', marker.type]"
              :style="{ top: marker.top, left: marker.left }" @click="selectMapMarker(marker)"
              @mouseenter="showMarkerInfo(marker, $event)" @mouseleave="hideMarkerInfo">
              <van-icon name="location" color="#fff" size="16" />
            </div>
          </div>

          <!-- 悬浮信息卡片 -->
          <div v-if="hoveredMarker" class="marker-tooltip" :style="tooltipStyle">
            <div class="tooltip-content">
              <h4 class="venue-name">{{ hoveredMarker.name }}</h4>
              <div class="venue-status">
                <van-tag :type="getMarkerStatusType(hoveredMarker.status)" size="small">
                  {{ getMarkerStatusText(hoveredMarker.status) }}
                </van-tag>
                <span class="venue-price">{{ hoveredMarker.price }}元/小时</span>
              </div>
            </div>
            <div class="tooltip-arrow"></div>
          </div>

          <div class="map-controls">
            <van-space direction="vertical" :size="8">
              <van-button icon="plus" size="small" @click="zoomIn" round />
              <van-button icon="minus" size="small" @click="zoomOut" round />
              <van-button icon="aim" size="small" @click="locateMe" round />
            </van-space>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 筛选弹窗 -->
    <van-popup v-model:show="showFilter" position="bottom" round>
      <div class="filter-popup">
        <van-nav-bar title="筛选条件" left-arrow @click-left="showFilter = false">
          <template #right>
            <van-button type="primary" size="small" @click="applyFilter">
              确定
            </van-button>
          </template>
        </van-nav-bar>

        <van-cell-group>
          <van-field label="场地类型">
            <template #input>
              <van-checkbox-group v-model="selectedVenueTypes">
                <van-space direction="vertical" :size="8">
                  <van-checkbox v-for="type in venueTypes" :key="type.value" :name="type.value">
                    {{ type.text }}
                  </van-checkbox>
                </van-space>
              </van-checkbox-group>
            </template>
          </van-field>

          <van-field label="价格范围">
            <template #input>
              <van-slider v-model="priceSlider" range :min="0" :max="200" :step="10" />
              <div class="price-range-text">
                {{ priceSlider[0] }}元 - {{ priceSlider[1] }}元
              </div>
            </template>
          </van-field>
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthManager from '../utils/auth.js';
import { showToast } from 'vant';

const router = useRouter();

// 响应式数据
const activeMode = ref('list');
const searchKeyword = ref('');
const venueType = ref('专业比赛场');
const priceRange = ref('所有价格');
const sortBy = ref('距离最近');
const showFilter = ref(false);
const showMap = ref(false);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const selectedVenue = ref(null);
const mapVenueRating = ref(4.9);

// 筛选相关
const selectedVenueTypes = ref(['专业比赛场']);
const priceSlider = ref([0, 200]);

// 选项数据
const venueTypeOptions = [
  { text: '专业比赛场', value: '专业比赛场' },
  { text: '休闲娱乐场', value: '休闲娱乐场' },
  { text: '训练场', value: '训练场' },
  { text: '室内场馆', value: '室内场馆' },
  { text: '室外场地', value: '室外场地' }
];

const priceRangeOptions = [
  { text: '所有价格', value: '所有价格' },
  { text: '50元以下', value: '50元以下' },
  { text: '50-100元', value: '50-100元' },
  { text: '100-150元', value: '100-150元' },
  { text: '150元以上', value: '150元以上' }
];

const sortOptions = [
  { text: '距离最近', value: '距离最近' },
  { text: '价格最低', value: '价格最低' },
  { text: '评分最高', value: '评分最高' },
  { text: '最新发布', value: '最新发布' }
];

const venueTypes = [
  { text: '专业比赛场', value: '专业比赛场' },
  { text: '休闲娱乐场', value: '休闲娱乐场' },
  { text: '训练场', value: '训练场' },
  { text: '室内场馆', value: '室内场馆' },
  { text: '室外场地', value: '室外场地' }
];

// 场地数据
const venues = ref([
  {
    id: 1,
    name: '人民公园篮球场',
    rating: 4.8,
    availableTime: '19:00-21:00有空场',
    price: 80,
    distance: 1.2,
    status: 'available',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'
  },
  {
    id: 2,
    name: '中心体育馆',
    rating: 4.6,
    availableTime: '22:00后有空场',
    price: 120,
    distance: 2.5,
    status: 'busy',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg'
  },
  {
    id: 3,
    name: '阳光体育公园',
    rating: 4.5,
    availableTime: '18:00-20:00有空场',
    price: 60,
    distance: 3.1,
    status: 'available',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
  },
  {
    id: 4,
    name: '城东体育中心',
    rating: 4.7,
    availableTime: '20:30后有空场',
    price: 90,
    distance: 4.3,
    status: 'soon',
    image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg'
  }
]);

// 悬浮信息相关
const hoveredMarker = ref(null);
const tooltipStyle = ref({});

// 地图标记点 (包含详细信息)
const mapMarkers = ref([
  {
    type: 'green',
    top: '30%',
    left: '60%',
    id: 1,
    name: '人民公园篮球场',
    status: 'available',
    price: 80
  },
  {
    type: 'green',
    top: '45%',
    left: '40%',
    id: 2,
    name: '阳光体育公园',
    status: 'available',
    price: 60
  },
  {
    type: 'red',
    top: '55%',
    left: '25%',
    id: 3,
    name: '中心体育馆',
    status: 'busy',
    price: 120
  },
  {
    type: 'red',
    top: '70%',
    left: '65%',
    id: 4,
    name: '星光篮球馆',
    status: 'busy',
    price: 150
  },
  {
    type: 'orange',
    top: '85%',
    left: '35%',
    id: 5,
    name: '城东体育中心',
    status: 'soon',
    price: 90
  }
]);

// 计算属性
const filteredVenues = computed(() => {
  let filtered = venues.value;

  if (searchKeyword.value) {
    filtered = filtered.filter(venue =>
      venue.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
  }

  if (priceRange.value !== '所有价格') {
    filtered = filtered.filter(venue => {
      switch (priceRange.value) {
        case '50元以下':
          return venue.price < 50;
        case '50-100元':
          return venue.price >= 50 && venue.price <= 100;
        case '100-150元':
          return venue.price > 100 && venue.price <= 150;
        case '150元以上':
          return venue.price > 150;
        default:
          return true;
      }
    });
  }

  switch (sortBy.value) {
    case '距离最近':
      return filtered.sort((a, b) => a.distance - b.distance);
    case '价格最低':
      return filtered.sort((a, b) => a.price - b.price);
    case '评分最高':
      return filtered.sort((a, b) => b.rating - a.rating);
    default:
      return filtered;
  }
});

// 方法
const goBack = () => {
  router.back();
};

const onModeChange = (name) => {
  if (name === 'map') {
    showMap.value = true;
  }
};

const onSearch = () => {
  // 执行搜索
};

const onClear = () => {
  searchKeyword.value = '';
};

const onRefresh = () => {
  setTimeout(() => {
    refreshing.value = false;
  }, 1000);
};

const onLoad = () => {
  setTimeout(() => {
    loading.value = false;
    finished.value = true;
  }, 1000);
};

// 处理场地卡片点击
const selectVenue = (venue) => {
  AuthManager.requireLogin(() => {
    // 登录后的操作 - 查看场地详情
    selectedVenue.value = venue;
    showToast(`查看场地详情：${venue.name}`);
    // 这里可以跳转到场地详情页面
  }, {
    message: '查看场地详情需要登录，是否立即登录？',
    feature: 'view-venue-detail'
  });
};

// 预订场地
const bookVenue = (venue) => {
  AuthManager.requireLogin(() => {
    // 登录后的操作 - 预订场地
    showToast(`预订场地：${venue.name}`);
    // 这里可以跳转到预订页面
  }, {
    message: '预订场地需要登录，是否立即登录？',
    feature: 'book-venue'
  });
};

// 电话咨询
const callVenue = (venue) => {
  AuthManager.requireLogin(() => {
    // 登录后的操作 - 查看联系方式
    showToast(`联系电话：138****8888`);
    // 这里可以显示真实的联系电话
  }, {
    message: '查看联系方式需要登录，是否立即登录？',
    feature: 'view-contact'
  });
};

const getStatusText = (status) => {
  switch (status) {
    case 'available':
      return '空闲';
    case 'busy':
      return '繁忙';
    case 'soon':
      return '即将空闲';
    default:
      return '未知';
  }
};

const getStatusType = (status) => {
  switch (status) {
    case 'available':
      return 'success';
    case 'busy':
      return 'danger';
    case 'soon':
      return 'warning';
    default:
      return 'default';
  }
};

const selectMapMarker = (marker) => {
  // 选择地图标记
};

// 悬浮信息相关方法
const showMarkerInfo = (marker, event) => {
  hoveredMarker.value = marker;

  // 获取鼠标位置和地图容器位置
  const rect = event.target.closest('.map-area').getBoundingClientRect();
  const markerRect = event.target.getBoundingClientRect();

  // 计算tooltip位置
  const tooltipWidth = 200; // 预估tooltip宽度
  const tooltipHeight = 80; // 预估tooltip高度

  let left = markerRect.left - rect.left - tooltipWidth / 2 + 16; // 16是marker的一半宽度
  let top = markerRect.top - rect.top - tooltipHeight - 10; // 10是箭头高度

  // 边界检测
  if (left < 10) left = 10;
  if (left + tooltipWidth > rect.width - 10) left = rect.width - tooltipWidth - 10;
  if (top < 10) {
    top = markerRect.bottom - rect.top + 10; // 显示在marker下方
  }

  tooltipStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    position: 'absolute',
    zIndex: 1000
  };
};

const hideMarkerInfo = () => {
  hoveredMarker.value = null;
  tooltipStyle.value = {};
};

// 获取标记状态文本
const getMarkerStatusText = (status) => {
  switch (status) {
    case 'available':
      return '空闲';
    case 'busy':
      return '繁忙';
    case 'soon':
      return '即将空闲';
    default:
      return '未知';
  }
};

// 获取标记状态类型
const getMarkerStatusType = (status) => {
  switch (status) {
    case 'available':
      return 'success';
    case 'busy':
      return 'danger';
    case 'soon':
      return 'warning';
    default:
      return 'default';
  }
};

const zoomIn = () => {
  // 放大地图
};

const zoomOut = () => {
  // 缩小地图
};

const locateMe = () => {
  // 定位到我的位置
};

const applyFilter = () => {
  showFilter.value = false;
  // 应用筛选条件
};

onMounted(() => {
  // Location组件已挂载
});
</script>

<style lang="scss" scoped>
.location-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.content-wrapper {
  padding-top: 46px;
}

.subtitle-section {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  color: #666;
  font-size: 14px;
}

.search-section {
  background: white;
  padding: 12px 16px;
  margin-bottom: 8px;
}

.filter-section {
  background: white;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;

  :deep(.van-dropdown-menu) {
    flex: 1;
  }

  .filter-btn {
    flex-shrink: 0;
  }
}

.venue-list-section {
  background: white;

  .list-title {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .venue-card {
    margin-bottom: 8px;
  }

  .rating-text,
  .time-text,
  .distance-text {
    font-size: 12px;
    color: #666;
  }

  .price {
    font-size: 16px;
    font-weight: bold;
    color: #1989fa;
  }
}

.map-popup {
  height: 100%;
  display: flex;
  flex-direction: column;

  .map-venue-card {
    padding: 16px;
    background: white;
  }

  .map-area {
    flex: 1;
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    .map-bg {
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f0f0f0"/><path d="M0 150 Q100 100 200 150 T400 150" stroke="%23ddd" stroke-width="2" fill="none"/><rect x="150" y="120" width="100" height="60" fill="%23e8f5e8" stroke="%23a8d8a8" stroke-width="2" rx="8"/><rect x="160" y="130" width="80" height="40" fill="%23d4a574" stroke="%23b8956a" stroke-width="1" rx="4"/></svg>') center/cover;
      position: relative;
    }

    .venue-marker {
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      transform: translate(-50%, -50%);

      &.green {
        background-color: #52c41a;
      }

      &.red {
        background-color: #ff4d4f;
      }

      &.orange {
        background-color: #fa8c16;
      }
    }

    .map-controls {
      position: absolute;
      right: 16px;
      bottom: 20px;
    }

    // 悬浮信息卡片样式
    .marker-tooltip {
      position: absolute;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      padding: 12px;
      min-width: 180px;
      max-width: 220px;
      z-index: 1000;
      animation: fadeIn 0.2s ease-in-out;

      .tooltip-content {
        .venue-name {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin: 0 0 8px 0;
          line-height: 1.2;
        }

        .venue-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;

          .venue-price {
            font-size: 14px;
            font-weight: bold;
            color: #1989fa;
          }
        }
      }

      .tooltip-arrow {
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid white;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }

      // 当tooltip显示在marker下方时，箭头在上方
      &.tooltip-below {
        .tooltip-arrow {
          top: -6px;
          bottom: auto;
          border-top: none;
          border-bottom: 6px solid white;
        }
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
}

.filter-popup {
  .price-range-text {
    text-align: center;
    margin-top: 8px;
    font-size: 12px;
    color: #666;
  }
}
</style>