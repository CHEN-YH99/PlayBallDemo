import { defineStore } from 'pinia'
import { nearbyAPI } from '@/services/api'

export const useNearbyStore = defineStore('nearby', {
  state: () => ({
    // 当前选择的位置
    selectedCity: '',
    selectedDistrict: '',

    // 数据
    players: [],
    activities: [],
    cities: {},

    // 状态
    loading: false,
    error: null,

    // 统计
    totalPlayers: 0,
    totalActivities: 0
  }),

  getters: {
    // 获取当前位置描述
    currentLocation: (state) => {
      if (state.selectedDistrict) {
        return `${state.selectedCity} ${state.selectedDistrict}`
      }
      return state.selectedCity || '请选择城市'
    },

    // 获取当前城市的所有地区
    currentCityDistricts: (state) => {
      return state.cities[state.selectedCity] || []
    },

    // 检查是否有数据
    hasData: (state) => {
      return state.players.length > 0 || state.activities.length > 0
    }
  },

  actions: {
    // 设置选择的城市
    setSelectedCity(city) {
      this.selectedCity = city
      this.selectedDistrict = '' // 重置地区选择
    },

    // 设置选择的地区
    setSelectedDistrict(district) {
      this.selectedDistrict = district
    },

    // 获取城市列表
    async fetchCities() {
      try {
        this.loading = true
        this.error = null

        const response = await nearbyAPI.getCities()
        if (response.success) {
          this.cities = response.data
        } else {
          throw new Error(response.message || '获取城市列表失败')
        }
      } catch (error) {
        this.error = error.message || '网络错误'
      } finally {
        this.loading = false
      }
    },

    // 获取附近数据（球友和活动）
    async fetchNearbyData() {
      if (!this.selectedCity) {
        this.error = '请先选择城市'
        return
      }

      try {
        this.loading = true
        this.error = null

        const response = await nearbyAPI.getNearbyData(
          this.selectedCity,
          this.selectedDistrict || null
        )

        if (response.success) {
          this.players = response.data.players || []
          this.activities = response.data.activities || []
          this.totalPlayers = response.data.total_players || 0
          this.totalActivities = response.data.total_activities || 0

          // 数据更新完成
        } else {
          throw new Error(response.message || '获取数据失败')
        }
      } catch (error) {
        this.error = error.message || '网络错误'
        // 只有在真正的网络错误时才清空数据
        if (!error.response) {
          this.players = []
          this.activities = []
          this.totalPlayers = 0
          this.totalActivities = 0
        }
      } finally {
        this.loading = false
      }
    },

    // 单独获取球友数据
    async fetchPlayers() {
      if (!this.selectedCity) {
        this.error = '请先选择城市'
        return
      }

      try {
        this.loading = true
        this.error = null

        const response = await nearbyAPI.getNearbyPlayers(
          this.selectedCity,
          this.selectedDistrict || null
        )

        if (response.success) {
          this.players = response.data
          this.totalPlayers = response.total
        } else {
          throw new Error(response.message || '获取球友数据失败')
        }
      } catch (error) {
        this.error = error.message || '网络错误'
        this.players = []
        this.totalPlayers = 0
      } finally {
        this.loading = false
      }
    },

    // 单独获取活动数据
    async fetchActivities() {
      if (!this.selectedCity) {
        this.error = '请先选择城市'
        return
      }

      try {
        this.loading = true
        this.error = null

        const response = await nearbyAPI.getActivities(
          this.selectedCity,
          this.selectedDistrict || null
        )

        if (response.success) {
          this.activities = response.data
          this.totalActivities = response.total
        } else {
          throw new Error(response.message || '获取活动数据失败')
        }
      } catch (error) {
        this.error = error.message || '网络错误'
        this.activities = []
        this.totalActivities = 0
      } finally {
        this.loading = false
      }
    },

    // 清空错误信息
    clearError() {
      this.error = null
    },

    // 重置所有数据
    reset() {
      this.selectedCity = ''
      this.selectedDistrict = ''
      this.players = []
      this.activities = []
      this.totalPlayers = 0
      this.totalActivities = 0
      this.error = null
      this.loading = false
    }
  }
})