<template>
  <div class="friend-list-container">
    <div class="friend-list-header">
      <h4 class="friend-list-title">{{ friendListTitle }}</h4>
      <div class="view-more" @click="handleViewMore">
        <span>查看更多</span>
        <van-icon name="arrow" color="#FF976A" />
      </div>
    </div>

    <div class="friend-list">
      <div class="friend-item" v-for="friend in friends" :key="friend.id" @click="handleFriendClick(friend)">
        <div class="avatar-container">
          <van-image round width="50" height="50" :src="friend.avatar" fit="cover" />
          <van-icon v-if="friend.isOnline" name="fire" class="online-icon" color="#FF976A" />
        </div>
        <div class="friend-name">{{ friend.name }}</div>
        <div class="friend-position">{{ friend.position }}</div>
      </div>
    </div>

    <div class="divider"></div>
  </div>
</template>

<script setup>
import { watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFriendStore } from "../stores/friendStore";
import { useLocationStore } from "../stores/locationStore";
import { storeToRefs } from "pinia";
import { requireAuth } from "../utils/authGuard.js";
import { showToast } from "vant";

const route = useRoute();
const router = useRouter();
const friendStore = useFriendStore();
const locationStore = useLocationStore();

// 从store中获取响应式数据
const { currentFriends: friends, friendListTitle } = storeToRefs(friendStore);

// 初始化时设置运动类型和加载数据
onMounted(async () => {
  const currentSport = friendStore.getSportTypeFromPath(route.path);
  await friendStore.setSportType(currentSport);
  
  // 检查是否有定位信息，如果没有则使用默认位置
  if (locationStore.locationDetails.city && locationStore.locationDetails.district) {
    // 使用定位信息
    await friendStore.setLocation(locationStore.locationDetails.city, locationStore.locationDetails.district);
  } else if (locationStore.currentCity && locationStore.currentCity !== '定位中...') {
    // 使用当前城市信息
    const cityParts = locationStore.currentCity.split(' ');
    if (cityParts.length >= 2) {
      await friendStore.setLocation(cityParts[0], cityParts[1]);
    } else {
      await friendStore.setLocation(locationStore.currentCity, '');
    }
  } else {
    // 使用默认位置
    await friendStore.setLocation('北京市', '朝阳区');
  }
});

// 监听路由变化
watch(() => route.path, async (newPath) => {
  const currentSport = friendStore.getSportTypeFromPath(newPath);
  await friendStore.setSportType(currentSport);
  await friendStore.loadFriends(true);
});

// 监听位置变化 - 统一处理位置更新
const updateLocationAndReload = async (city, district) => {
  if (city && city !== '定位中...' && !city.includes('定位')) {
    await friendStore.setLocation(city, district || '');
  }
};

// 监听位置详情变化
watch(() => locationStore.locationDetails, async (newLocation) => {
  if (newLocation.city) {
    await updateLocationAndReload(newLocation.city, newLocation.district);
  }
}, { deep: true });

// 监听显示城市变化
watch(() => locationStore.displayCity, async (newDisplayCity) => {
  if (newDisplayCity && newDisplayCity !== '定位中...' && !newDisplayCity.includes('定位')) {
    // 优先使用详细位置信息
    if (locationStore.locationDetails.city && locationStore.locationDetails.district) {
      await updateLocationAndReload(
        locationStore.locationDetails.city, 
        locationStore.locationDetails.district
      );
    } else {
      // 如果没有详细信息，尝试从显示城市中解析
      const cityParts = newDisplayCity.split(' ');
      if (cityParts.length >= 2) {
        await updateLocationAndReload(cityParts[0], cityParts[1]);
      } else {
        await updateLocationAndReload(newDisplayCity, '');
      }
    }
  }
});

// 处理好友头像点击
const handleFriendClick = async (friend) => {
  const isAuthenticated = await requireAuth({
    message: '查看好友资料需要登录',
    router,
    onSuccess: () => {
      // 登录后跳转到好友详情页面，传递当前页面信息
      router.push({
        path: `/friend/${friend.id}`,
        query: {
          from: route.path,
          sport: route.meta?.sport || route.meta?.page
        }
      });
    }
  });
};

// 处理查看更多点击
const handleViewMore = async () => {
  const isAuthenticated = await requireAuth({
    message: '查看更多好友需要登录',
    router,
    onSuccess: () => {
      // 登录后的操作
      showToast('查看更多好友');
      // 这里可以跳转到好友列表页面
      router.push('/friends');
    }
  });
};
</script>

<style lang="scss" scoped>
.friend-list-container {
  padding: 16px 16px 12px;
  background-color: #fff;
}

.friend-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.friend-list-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.view-more {
  display: flex;
  align-items: center;
  color: #ff976a;
  font-size: 14px;

  span {
    margin-right: 4px;
  }
}

.friend-list {
  display: flex;
  justify-content: flex-start;
  overflow-x: auto;
  padding-bottom: 25px;

  /* Custom scrollbar for modern browsers */
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }
}

.friend-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
  margin-right: 10px;

  &:last-child {
    margin-right: 0;
  }
}

.avatar-container {
  position: relative;
  margin-bottom: 8px;
}

.online-icon {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  font-size: 22px;
  box-shadow: none;
}

.friend-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.friend-position {
  font-size: 11px;
  color: #999;
}

.divider {
  height: 1px;
  background-color: #f5f5f5;
  margin-top: 10px;
  width: 100%;
}
</style>