import { defineStore } from 'pinia';
import ApiService from '../services/api.js';

export const useSportsStore = defineStore('sports', {
  state: () => ({
    // 运动项目数据
    sports: [],
    currentSport: null,
    
    // 活动数据
    activities: [],
    currentActivity: null,
    
    // 场地数据
    venues: [],
    favoriteVenues: [],
    
    // 加载状态
    loading: {
      sports: false,
      activities: false,
      venues: false,
      creating: false
    },
    
    // 筛选条件
    filters: {
      sportId: null,
      status: null,
      sortBy: null
    }
  }),

  getters: {
    // 根据ID获取运动项目
    getSportById: (state) => (id) => {
      return state.sports.find(sport => sport.id === id);
    },
    
    // 根据当前运动项目获取活动
    currentSportActivities: (state) => {
      if (!state.currentSport) return state.activities;
      return state.activities.filter(activity => activity.sport === state.currentSport.id);
    },
    
    // 获取招募中的活动
    recruitingActivities: (state) => {
      return state.activities.filter(activity => activity.status === 'recruiting');
    },
    
    // 根据运动项目获取场地
    venuesBySport: (state) => (sportId) => {
      if (!sportId) return state.venues;
      return state.venues.filter(venue => venue.sports.includes(sportId));
    }
  },

  actions: {
    // 获取所有运动项目
    async fetchSports() {
      this.loading.sports = true;
      
      try {
        const response = await ApiService.getSports();
        if (response.success) {
          this.sports = response.data;
        }
      } catch (error) {
        console.error('获取运动项目失败:', error);
      } finally {
        this.loading.sports = false;
      }
    },

    // 设置当前运动项目
    setCurrentSport(sport) {
      this.currentSport = sport;
      this.filters.sportId = sport?.id || null;
    },

    // 获取活动列表
    async fetchActivities(filters = {}) {
      this.loading.activities = true;
      
      try {
        const mergedFilters = { ...this.filters, ...filters };
        const response = await ApiService.getActivities(mergedFilters);
        
        if (response.success) {
          this.activities = response.data;
        }
      } catch (error) {
        console.error('获取活动列表失败:', error);
      } finally {
        this.loading.activities = false;
      }
    },

    // 创建活动
    async createActivity(activityData) {
      this.loading.creating = true;
      
      try {
        const response = await ApiService.createActivity(activityData);
        if (response.success) {
          this.activities.unshift(response.data);
          return response;
        }
      } catch (error) {
        console.error('创建活动失败:', error);
        throw error;
      } finally {
        this.loading.creating = false;
      }
    },

    // 加入活动
    async joinActivity(activityId, userId) {
      try {
        const response = await ApiService.joinActivity(activityId, userId);
        if (response.success) {
          // 更新本地活动数据
          const activity = this.activities.find(a => a.id === activityId);
          if (activity) {
            activity.currentPlayers += 1;
          }
        }
        return response;
      } catch (error) {
        console.error('加入活动失败:', error);
        throw error;
      }
    },

    // 获取场地列表
    async fetchVenues(filters = {}) {
      this.loading.venues = true;
      
      try {
        const response = await ApiService.getVenues(filters);
        if (response.success) {
          this.venues = response.data;
        }
      } catch (error) {
        console.error('获取场地列表失败:', error);
      } finally {
        this.loading.venues = false;
      }
    },

    // 搜索活动
    async searchActivities(keyword) {
      this.loading.activities = true;
      
      try {
        const response = await ApiService.searchActivities(keyword);
        if (response.success) {
          this.activities = response.data;
        }
      } catch (error) {
        console.error('搜索活动失败:', error);
      } finally {
        this.loading.activities = false;
      }
    },

    // 搜索场地
    async searchVenues(keyword) {
      this.loading.venues = true;
      
      try {
        const response = await ApiService.searchVenues(keyword);
        if (response.success) {
          this.venues = response.data;
        }
      } catch (error) {
        console.error('搜索场地失败:', error);
      } finally {
        this.loading.venues = false;
      }
    },

    // 获取收藏场地
    async fetchFavoriteVenues(userId) {
      try {
        const response = await ApiService.getFavoriteVenues(userId);
        if (response.success) {
          this.favoriteVenues = response.data;
        }
      } catch (error) {
        console.error('获取收藏场地失败:', error);
      }
    },

    // 添加收藏场地
    async addFavoriteVenue(userId, venueId) {
      try {
        const response = await ApiService.addFavoriteVenue(userId, venueId);
        if (response.success) {
          const venue = this.venues.find(v => v.id === venueId);
          if (venue && !this.favoriteVenues.find(v => v.id === venueId)) {
            this.favoriteVenues.push(venue);
          }
        }
        return response;
      } catch (error) {
        console.error('添加收藏场地失败:', error);
        throw error;
      }
    },

    // 取消收藏场地
    async removeFavoriteVenue(userId, venueId) {
      try {
        const response = await ApiService.removeFavoriteVenue(userId, venueId);
        if (response.success) {
          this.favoriteVenues = this.favoriteVenues.filter(v => v.id !== venueId);
        }
        return response;
      } catch (error) {
        console.error('取消收藏场地失败:', error);
        throw error;
      }
    },

    // 设置筛选条件
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },

    // 清除筛选条件
    clearFilters() {
      this.filters = {
        sportId: null,
        status: null,
        sortBy: null
      };
    }
  }
});