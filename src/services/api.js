import axios from 'axios'
import database from './database.js'
import { apiConfig } from '../config/api.js'

// 创建axios实例
const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    if (apiConfig.showRequestLogs) {
      console.log('发送请求:', config.url, config.params)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (apiConfig.showErrorLogs) {
      console.error('API请求错误:', error)
    }
    return Promise.reject(error)
  }
)

// 附近功能API
const nearbyAPI = {
  // 获取附近的球友和活动（推荐使用）
  async getNearbyData(city, district = null) {
    // 如果禁用了后端API，直接使用本地数据
    if (!apiConfig.enableBackendAPI) {
      const players = await database.getFriendsByLocation(city, district)
      const activities = await database.getActivitiesByLocation(city, district)
      return {
        success: true,
        data: {
          players: players,
          activities: activities,
          total_players: players.length,
          total_activities: activities.length
        }
      }
    }

    // 尝试调用后端API
    try {
      const params = { city }
      if (district) {
        params.district = district
      }
      const response = await api.get('/nearby', { params })
      return response
    } catch (error) {
      if (apiConfig.showErrorLogs) {
        console.error('后端API调用失败，使用本地数据:', error)
      }
      // Fallback to local data
      const players = await database.getFriendsByLocation(city, district)
      const activities = await database.getActivitiesByLocation(city, district)
      return {
        success: true,
        data: {
          players: players,
          activities: activities,
          total_players: players.length,
          total_activities: activities.length
        }
      }
    }
  },

  // 单独获取球友数据
  async getNearbyPlayers(city, district = null) {
    // 如果禁用了后端API，直接使用本地数据
    if (!apiConfig.enableBackendAPI) {
      const players = await database.getFriendsByLocation(city, district)
      return {
        success: true,
        data: players,
        total: players.length
      }
    }

    // 尝试调用后端API
    try {
      const params = { city }
      if (district) {
        params.district = district
      }
      const response = await api.get('/nearby_players', { params })
      return response
    } catch (error) {
      if (apiConfig.showErrorLogs) {
        console.error('后端API调用失败，使用本地数据:', error)
      }
      const players = await database.getFriendsByLocation(city, district)
      return {
        success: true,
        data: players,
        total: players.length
      }
    }
  },

  // 单独获取活动数据
  async getActivities(city, district = null) {
    // 如果禁用了后端API，直接使用本地数据
    if (!apiConfig.enableBackendAPI) {
      const activities = await database.getActivitiesByLocation(city, district)
      return {
        success: true,
        data: activities,
        total: activities.length
      }
    }

    // 尝试调用后端API
    try {
      const params = { city }
      if (district) {
        params.district = district
      }
      const response = await api.get('/activities', { params })
      return response
    } catch (error) {
      if (apiConfig.showErrorLogs) {
        console.error('后端API调用失败，使用本地数据:', error)
      }
      const activities = await database.getActivitiesByLocation(city, district)
      return {
        success: true,
        data: activities,
        total: activities.length
      }
    }
  },

  // 获取所有城市和地区列表
  async getCities() {
    // 如果禁用了后端API，直接使用本地数据
    if (!apiConfig.enableBackendAPI) {
      return {
        success: true,
        data: await database.getAllLocations()
      }
    }

    // 尝试调用后端API
    try {
      const response = await api.get('/cities')
      return response
    } catch (error) {
      if (apiConfig.showErrorLogs) {
        console.error('后端API调用失败，使用本地数据:', error)
      }
      return {
        success: true,
        data: await database.getAllLocations()
      }
    }
  }
}

// 完整的API服务对象
const ApiService = {
  // 用户相关API
  async login(phone, password) {
    // 模拟登录API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        if (phone === '13800138001' && password === '123456') {
          resolve({
            success: true,
            data: {
              user: {
                id: 'user1',
                name: '张三',
                phone: phone,
                avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg'
              },
              token: 'mock-token-' + Date.now()
            }
          })
        } else {
          resolve({
            success: false,
            message: '用户名或密码错误'
          })
        }
      }, 1000)
    })
  },

  async register(userData) {
    // 模拟注册API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            user: {
              id: 'user_' + Date.now(),
              name: userData.name || '新用户',
              phone: userData.phone,
              avatar: 'https://img01.yzcdn.cn/vant/cat.jpeg'
            },
            token: 'mock-token-' + Date.now()
          }
        })
      }, 1000)
    })
  },

  async logout(token) {
    // 模拟退出登录API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: '退出登录成功'
        })
      }, 500)
    })
  },

  async getUserStats(userId) {
    // 模拟获取用户统计数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            activitiesJoined: 15,
            activitiesCreated: 8,
            friendsCount: 23,
            totalScore: 1250,
            level: 'intermediate',
            achievements: ['连续签到7天', '参与活动达人', '社交达人']
          }
        })
      }, 800)
    })
  },

  async updateUserStats(userId, stats) {
    // 模拟更新用户统计数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: stats
        })
      }, 500)
    })
  },

  async sendSmsCode(phone) {
    // 模拟发送短信验证码
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: '验证码已发送'
        })
      }, 1000)
    })
  },

  // 运动相关API
  async getSports() {
    // 模拟获取运动类型列表
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            { id: 'basketball', name: '篮球', icon: '🏀' },
            { id: 'football', name: '足球', icon: '⚽' },
            { id: 'badminton', name: '羽毛球', icon: '🏸' },
            { id: 'tennis', name: '网球', icon: '🎾' },
            { id: 'volleyball', name: '排球', icon: '🏐' },
            { id: 'running', name: '跑步', icon: '🏃' }
          ]
        })
      }, 500)
    })
  },

  async getActivities(filters = {}) {
    // 使用本地数据库获取活动列表
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const activities = await database.getActivitiesByLocation(
          filters.city,
          filters.district,
          filters.sport
        )
        resolve({
          success: true,
          data: activities
        })
      }, 800)
    })
  },

  async createActivity(activityData) {
    // 使用本地数据库创建活动
    return new Promise((resolve) => {
      setTimeout(() => {
        const activity = database.createActivity(activityData)
        resolve({
          success: true,
          data: activity
        })
      }, 1000)
    })
  },

  async joinActivity(activityId, userId) {
    // 使用本地数据库加入活动
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = database.joinActivity(activityId, userId)
        resolve(result)
      }, 800)
    })
  },

  async getVenues(filters = {}) {
    // 模拟获取场馆列表
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: [
            {
              id: 'venue1',
              name: '朝阳公园篮球场',
              address: '北京市朝阳区朝阳公园南路1号',
              sports: ['basketball'],
              rating: 4.5,
              price: '免费',
              image: 'https://img01.yzcdn.cn/vant/cat.jpeg'
            },
            {
              id: 'venue2',
              name: '工人体育场',
              address: '北京市朝阳区工体北路',
              sports: ['football'],
              rating: 4.8,
              price: '50元/小时',
              image: 'https://img01.yzcdn.cn/vant/tree.jpg'
            }
          ]
        })
      }, 600)
    })
  },

  async searchActivities(keyword) {
    // 使用本地数据库搜索活动
    return new Promise((resolve) => {
      setTimeout(() => {
        const activities = database.searchActivities(keyword)
        resolve({
          success: true,
          data: activities
        })
      }, 800)
    })
  },

  async searchVenues(keyword) {
    // 模拟搜索场馆
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: []
        })
      }, 600)
    })
  },

  async getFavoriteVenues(userId) {
    // 模拟获取收藏场馆
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: []
        })
      }, 500)
    })
  },

  async addFavoriteVenue(userId, venueId) {
    // 模拟添加收藏场馆
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: '收藏成功'
        })
      }, 500)
    })
  },

  async removeFavoriteVenue(userId, venueId) {
    // 模拟移除收藏场馆
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: '取消收藏成功'
        })
      }, 500)
    })
  },

  // 附近功能API（整合到主服务中）
  getNearbyData: nearbyAPI.getNearbyData,
  getNearbyPlayers: nearbyAPI.getNearbyPlayers,
  getCities: nearbyAPI.getCities
}

export { nearbyAPI }
export default ApiService