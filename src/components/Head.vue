<script setup>
import { ref, computed, onMounted } from "vue";
import { showToast, showDialog } from "vant";
import { useLocationStore } from "../stores/locationStore.js";
import { useSearchStore } from "../stores/searchStore.js";
import { useNotificationStore } from "../stores/notificationStore.js";
import { notificationService } from "../services/notificationService.js";
import { cityData } from "../utils/cityData.js";
import SearchPanel from "./SearchPanel.vue";
import NotificationPanel from "./NotificationPanel.vue";

const locationStore = useLocationStore();
const searchStore = useSearchStore();
const notificationStore = useNotificationStore();
const showCityPicker = ref(false); // 是否显示城市选择器
const notificationPanelRef = ref(null); // 通知面板引用

// 使用store中的数据
const currentCity = computed(() => locationStore.displayCity);
const isLocating = computed(() => locationStore.isLocating);

// 三级联动数据
const provinceList = ref([]); // 省份列表
const cityList = ref([]); // 城市列表
const districtList = ref([]); // 区县列表

// 选中的索引
const selectedProvinceIndex = ref(0);
const selectedCityIndex = ref(0);
const selectedDistrictIndex = ref(0);

// 选中的数据
const selectedProvince = ref(null);
const selectedCity = ref(null);
const selectedDistrict = ref(null);

// 页面加载时初始化三级联动数据（不再自动定位）
onMounted(() => {
  initializeCascader();
  searchStore.initialize();
  notificationStore.initialize();
  
  // 初始化通知服务
  notificationService.initialize(notificationStore);
});

// 处理搜索框点击
const handleSearchClick = () => {
  searchStore.toggleSearchPanel(true);
};

// 处理通知图标点击
const handleNotificationClick = () => {
  if (notificationPanelRef.value) {
    notificationPanelRef.value.togglePanel(true);
  }
  
  // 记录用户交互
  notificationService.trackUserInteraction('notification_panel_opened');
};

// 初始化三级联动数据
const initializeCascader = () => {
  // 初始化省份列表
  provinceList.value = cityData.map(province => ({
    text: province.text,
    value: province.value,
    data: province
  }));
  
  // 初始化第一个省份的城市列表
  if (cityData.length > 0) {
    selectedProvince.value = cityData[0];
    updateCityList(0);
  }
};

// 选择省份
const selectProvince = (index) => {
  selectedProvinceIndex.value = index;
  selectedProvince.value = cityData[index];
  updateCityList(index);
};

// 更新城市列表
const updateCityList = (provinceIndex) => {
  const province = cityData[provinceIndex];
  
  if (province && province.children) {
    cityList.value = province.children.map(city => ({
      text: city.text,
      value: city.value,
      data: city
    }));
    
    // 重置城市选择为第一个
    selectedCityIndex.value = 0;
    selectedCity.value = province.children[0];
    
    // 更新区县列表
    updateDistrictList(0);
  } else {
    cityList.value = [];
    districtList.value = [];
    selectedCity.value = null;
    selectedDistrict.value = null;
  }
};

// 选择城市
const selectCity = (index) => {
  selectedCityIndex.value = index;
  selectedCity.value = selectedProvince.value.children[index];
  updateDistrictList(index);
};

// 更新区县列表
const updateDistrictList = (cityIndex) => {
  const city = selectedProvince.value.children[cityIndex];
  
  if (city && city.children) {
    districtList.value = city.children.map(district => ({
      text: district.text,
      value: district.value,
      data: district
    }));
    
    // 重置区县选择为第一个
    selectedDistrictIndex.value = 0;
    selectedDistrict.value = city.children[0];
  } else {
    districtList.value = [];
    selectedDistrict.value = null;
  }
};

// 选择区县
const selectDistrict = (index) => {
  selectedDistrictIndex.value = index;
  selectedDistrict.value = selectedCity.value.children[index];
};

// 确认选择
const confirmCitySelection = () => {
  let displayText = '';
  let fullAddress = '';
  let cityName = '';
  let districtName = '';
  
  if (selectedDistrict.value) {
    // 选择了区县
    displayText = selectedDistrict.value.text;
    cityName = selectedCity.value.text;
    districtName = selectedDistrict.value.text;
    
    if (['北京市', '上海市', '天津市', '重庆市'].includes(selectedProvince.value.text)) {
      fullAddress = `${selectedProvince.value.text} ${selectedDistrict.value.text}`;
    } else {
      fullAddress = `${selectedProvince.value.text} ${selectedCity.value.text} ${selectedDistrict.value.text}`;
    }
  } else if (selectedCity.value) {
    // 选择了城市
    displayText = selectedCity.value.text;
    cityName = selectedCity.value.text;
    districtName = '';
    
    if (['北京市', '上海市', '天津市', '重庆市'].includes(selectedProvince.value.text)) {
      fullAddress = selectedCity.value.text;
    } else {
      fullAddress = `${selectedProvince.value.text} ${selectedCity.value.text}`;
    }
  } else if (selectedProvince.value) {
    // 只选择了省份
    displayText = selectedProvince.value.text;
    cityName = selectedProvince.value.text;
    districtName = '';
    fullAddress = selectedProvince.value.text;
  }
  
  if (displayText) {
    // 使用locationStore的方法更新城市信息
    locationStore.updateCity({
      displayText,
      city: cityName,
      province: selectedProvince.value?.text || '',
      district: districtName,
      fullAddress
    });
    
    showCityPicker.value = false;
  } else {
    showToast({
      message: "请选择地区",
      type: "fail",
    });
  }
};



// 手动获取地理位置
const getLocation = async () => {
  try {
    // 显示选择对话框
    const action = await showDialog({
      title: "位置信息",
      message: "请选择获取位置的方式",
      showCancelButton: true,
      confirmButtonText: "自动定位",
      cancelButtonText: "手动选择",
    }).catch(() => "cancel");

    if (action === "confirm") {
      // 用户选择自动定位，使用locationStore的方法
      await locationStore.manualLocation();
    } else if (action === "cancel") {
      // 用户选择手动选择城市
      showCityPicker.value = true;
    }
  } catch (error) {
    // Dialog error
  }
};


</script>

<template>
  <van-row align="center" class="header-container">
    <!-- 左侧：城市定位 -->
    <van-col span="6" class="location-col" @click="getLocation">
      <van-icon name="location" size="18" :class="{ rotating: isLocating }" />
      <span class="city-text">{{ currentCity }}</span>
    </van-col>

    <!-- 中间：搜索框 -->
    <van-col span="12" class="search-col">
      <div class="search-wrapper" @click="handleSearchClick">
        <van-search
          :model-value="searchStore.searchQuery"
          placeholder="搜索球友、活动、场地..."
          shape="round"
          background="transparent"
          input-align="left"
          readonly
          @click="handleSearchClick"
        >
          <template #left-icon>
            <van-icon name="search" />
          </template>
        </van-search>
      </div>
    </van-col>

    <!-- 右侧：通知图标 -->
    <van-col span="6" class="notification-col">
      <div class="notification-wrapper" @click="handleNotificationClick">
        <van-icon 
          name="bell" 
          size="20" 
          :class="{ 
            'notification-urgent': notificationStore.getActionRequiredNotifications().length > 0,
            'notification-shake': notificationStore.unreadCount > 0 && notificationStore.getActionRequiredNotifications().length > 0
          }"
        />
        <van-badge 
          v-if="notificationStore.unreadCount > 0"
          :content="notificationStore.unreadCount"
          max="99"
          class="notification-badge"
          :class="{
            'badge-urgent': notificationStore.getActionRequiredNotifications().length > 0
          }"
        />
        <!-- 紧急通知指示器 -->
        <div 
          v-if="notificationStore.getActionRequiredNotifications().length > 0"
          class="urgent-indicator"
        />
      </div>
    </van-col>
  </van-row>

  <!-- 三级联动城市选择器 -->
  <van-popup v-model:show="showCityPicker" position="bottom" round>
    <div class="cascader-container">
      <!-- 标题栏 -->
      <div class="cascader-header">
        <van-button 
          type="default" 
          size="small" 
          @click="showCityPicker = false"
        >
          取消
        </van-button>
        <h3 class="cascader-title">选择地区</h3>
        <van-button 
          type="primary" 
          size="small" 
          @click="confirmCitySelection"
        >
          确定
        </van-button>
      </div>

      <!-- 三级联动选择区域 -->
      <div class="cascader-content">
        <div class="cascader-columns">
          <!-- 省份列 -->
          <div class="cascader-column">
            <div class="column-header">省/直辖市</div>
            <div class="column-list">
              <div 
                v-for="(province, index) in provinceList" 
                :key="province.value"
                :class="['list-item', { active: selectedProvinceIndex === index }]"
                @click="selectProvince(index)"
              >
                {{ province.text }}
              </div>
            </div>
          </div>
          
          <!-- 城市列 -->
          <div class="cascader-column">
            <div class="column-header">市/区</div>
            <div class="column-list">
              <div 
                v-for="(city, index) in cityList" 
                :key="city.value"
                :class="['list-item', { active: selectedCityIndex === index }]"
                @click="selectCity(index)"
              >
                {{ city.text }}
              </div>
            </div>
          </div>
          
          <!-- 区县列 -->
          <div class="cascader-column">
            <div class="column-header">区/县</div>
            <div class="column-list">
              <div 
                v-for="(district, index) in districtList" 
                :key="district.value"
                :class="['list-item', { active: selectedDistrictIndex === index }]"
                @click="selectDistrict(index)"
              >
                {{ district.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-popup>

  <!-- 搜索面板 -->
  <SearchPanel />
  
  <!-- 通知面板 -->
  <NotificationPanel ref="notificationPanelRef" />
</template>

<style lang="scss" scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 54px;
  background-color: #fff;
  padding: 0 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .location-col {
    display: flex;
    align-items: center;
    cursor: pointer;

    .van-icon {
      color: #1e91f0;

      &.rotating {
        animation: rotate 1.5s linear infinite;
      }
    }

    .city-text {
      margin-left: 4px;
      font-weight: bold;
      font-size: 16px;
      color: #333;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .search-col {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .search-wrapper {
      width: 100%;
      cursor: pointer;

      .van-search {
        width: 100%;
        height: 36px;
        
        .van-search__content {
          background-color: #f5f5f5;
          border-radius: 18px;
          transition: all 0.3s ease;
          
          &:hover {
            background-color: #e8f3ff;
            box-shadow: 0 2px 8px rgba(25, 137, 250, 0.15);
          }
        }
        
        .van-field__left-icon {
          padding-left: 12px;
          
          .van-icon {
            color: #1989fa;
            font-size: 16px;
          }
        }
        
        .van-field__control {
          color: #646566;
          font-size: 14px;
          
          &::placeholder {
            color: #969799;
          }
        }
      }
    }
  }

  .notification-col {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: relative;
    
    .notification-wrapper {
      position: relative;
      padding: 8px;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.3s ease;
      
      &:hover {
        background-color: #f0f9ff;
      }
      
      &:active {
        transform: scale(0.95);
      }
      
      .van-icon {
        color: #1989fa;
        transition: color 0.3s ease;
      }
      
      .notification-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        z-index: 1;
        
        :deep(.van-badge__wrapper) {
          .van-badge {
            background: linear-gradient(135deg, #ff6b6b, #ee5a24);
            border: 2px solid #fff;
            box-shadow: 0 2px 4px rgba(238, 90, 36, 0.3);
            animation: pulse 2s infinite;
          }
        }
      }
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-2px); }
    75% { transform: translateX(2px); }
  }
  
  @keyframes urgentPulse {
    0% { 
      transform: scale(1);
      color: #1989fa;
    }
    50% { 
      transform: scale(1.1);
      color: #ee0a24;
    }
    100% { 
      transform: scale(1);
      color: #1989fa;
    }
  }
  
  .notification-urgent {
    animation: urgentPulse 1.5s infinite;
  }
  
  .notification-shake {
    animation: shake 0.5s ease-in-out infinite;
  }
  
  .badge-urgent {
    :deep(.van-badge) {
      background: linear-gradient(135deg, #ee0a24, #ff4757) !important;
      animation: pulse 1s infinite;
    }
  }
  
  .urgent-indicator {
    position: absolute;
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    background: #ee0a24;
    border-radius: 50%;
    border: 2px solid #fff;
    animation: pulse 1s infinite;
  }
}

/* 三级联动选择器样式 */
.cascader-container {
  background: #fff;
  border-radius: 16px 16px 0 0;
  max-height: 70vh;
  overflow: hidden;

  .cascader-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #ebedf0;
    background: #fff;

    .cascader-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #323233;
    }
  }

  .cascader-content {
    height: 400px;
    overflow: hidden;

    .cascader-columns {
      display: flex;
      height: 100%;

      .cascader-column {
        flex: 1;
        border-right: 1px solid #ebedf0;

        &:last-child {
          border-right: none;
        }

        .column-header {
          padding: 12px 16px;
          background: #f7f8fa;
          font-size: 14px;
          font-weight: 500;
          color: #646566;
          text-align: center;
          border-bottom: 1px solid #ebedf0;
        }

        .column-list {
          height: calc(100% - 45px);
          overflow-y: auto;

          .list-item {
            padding: 12px 16px;
            font-size: 14px;
            color: #323233;
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 1px solid #f7f8fa;

            &:hover {
              background: #f7f8fa;
            }

            &.active {
              background: #e8f3ff;
              color: #1989fa;
              font-weight: 500;
              position: relative;

              &::after {
                content: '';
                position: absolute;
                right: 16px;
                top: 50%;
                transform: translateY(-50%);
                width: 6px;
                height: 6px;
                background: #1989fa;
                border-radius: 50%;
              }
            }

            &:last-child {
              border-bottom: none;
            }
          }
        }
      }
    }
  }
}

/* 滚动条样式 */
.column-list::-webkit-scrollbar {
  width: 4px;
}

.column-list::-webkit-scrollbar-track {
  background: #f7f8fa;
}

.column-list::-webkit-scrollbar-thumb {
  background: #c8c9cc;
  border-radius: 2px;
}

.column-list::-webkit-scrollbar-thumb:hover {
  background: #969799;
}
</style>