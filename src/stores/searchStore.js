import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import database from '../services/database.js'

export const useSearchStore = defineStore('search', () => {
  // 搜索状态
  const searchQuery = ref('')
  const isSearching = ref(false)
  const showSearchPanel = ref(false)
  const searchHistory = ref([])
  const searchResults = ref({
    players: [],
    activities: [],
    venues: []
  })

  // 热门搜索词
  const hotSearches = ref([
    '篮球', '足球', '羽毛球', '网球', '乒乓球',
    '朝阳区', '海淀区', '天河区', '浦东新区',
    '友谊赛', '训练', '比赛', '教练', '新手'
  ])

  // 搜索建议
  const searchSuggestions = ref([])

  // 计算属性
  const hasSearchQuery = computed(() => searchQuery.value.trim().length > 0)
  const hasSearchResults = computed(() => 
    searchResults.value.players.length > 0 || 
    searchResults.value.activities.length > 0 || 
    searchResults.value.venues.length > 0
  )
  const totalResultsCount = computed(() => 
    searchResults.value.players.length + 
    searchResults.value.activities.length + 
    searchResults.value.venues.length
  )

  // 搜索建议生成
  const generateSuggestions = async (query) => {
    if (!query || query.length < 2) {
      searchSuggestions.value = []
      return
    }

    try {
      const data = await database.loadJsonData()
      const suggestions = new Set()

      // 从球友数据中提取建议
      data.players?.forEach(player => {
        if (player.name?.includes(query)) suggestions.add(player.name)
        if (player.city?.includes(query)) suggestions.add(player.city)
        if (player.district?.includes(query)) suggestions.add(player.district)
        player.sports?.forEach(sport => {
          if (sport.includes(query)) suggestions.add(sport)
        })
        if (player.position?.includes(query)) suggestions.add(player.position)
      })

      // 从活动数据中提取建议
      data.activities?.forEach(activity => {
        if (activity.title?.includes(query)) suggestions.add(activity.title)
        if (activity.sport?.includes(query)) suggestions.add(activity.sport)
        if (activity.location?.includes(query)) suggestions.add(activity.location)
        if (activity.city?.includes(query)) suggestions.add(activity.city)
        if (activity.district?.includes(query)) suggestions.add(activity.district)
      })

      // 添加热门搜索中匹配的项
      hotSearches.value.forEach(hot => {
        if (hot.includes(query)) suggestions.add(hot)
      })

      searchSuggestions.value = Array.from(suggestions).slice(0, 8)
    } catch (error) {
      console.error('生成搜索建议失败:', error)
      searchSuggestions.value = []
    }
  }

  // 执行搜索
  const performSearch = async (query) => {
    if (!query || query.trim().length === 0) {
      searchResults.value = { players: [], activities: [], venues: [] }
      return
    }

    isSearching.value = true
    const trimmedQuery = query.trim()

    try {
      const data = await database.loadJsonData()
      
      // 搜索球友
      const players = data.players?.filter(player => {
        return player.name?.includes(trimmedQuery) ||
               player.city?.includes(trimmedQuery) ||
               player.district?.includes(trimmedQuery) ||
               player.sports?.some(sport => sport.includes(trimmedQuery)) ||
               player.position?.includes(trimmedQuery) ||
               player.introduction?.includes(trimmedQuery)
      }) || []

      // 搜索活动
      const activities = data.activities?.filter(activity => {
        return activity.title?.includes(trimmedQuery) ||
               activity.sport?.includes(trimmedQuery) ||
               activity.location?.includes(trimmedQuery) ||
               activity.city?.includes(trimmedQuery) ||
               activity.district?.includes(trimmedQuery) ||
               activity.description?.includes(trimmedQuery) ||
               activity.organizer?.includes(trimmedQuery)
      }) || []

      // 搜索场地（从活动中提取）
      const venueSet = new Set()
      activities.forEach(activity => {
        if (activity.location?.includes(trimmedQuery)) {
          venueSet.add(JSON.stringify({
            id: `venue_${activity.id}`,
            name: activity.location,
            address: activity.address,
            city: activity.city,
            district: activity.district,
            sports: [activity.sport]
          }))
        }
      })
      const venues = Array.from(venueSet).map(v => JSON.parse(v))

      searchResults.value = { players, activities, venues }
      
      // 添加到搜索历史
      addToHistory(trimmedQuery)
      
    } catch (error) {
      console.error('搜索失败:', error)
      searchResults.value = { players: [], activities: [], venues: [] }
    } finally {
      isSearching.value = false
    }
  }

  // 添加到搜索历史
  const addToHistory = (query) => {
    if (!query || query.trim().length === 0) return
    
    const trimmedQuery = query.trim()
    
    // 移除重复项
    const filteredHistory = searchHistory.value.filter(item => item !== trimmedQuery)
    
    // 添加到开头
    searchHistory.value = [trimmedQuery, ...filteredHistory].slice(0, 10)
    
    // 保存到本地存储
    try {
      localStorage.setItem('playball_search_history', JSON.stringify(searchHistory.value))
    } catch (error) {
      console.error('保存搜索历史失败:', error)
    }
  }

  // 加载搜索历史
  const loadSearchHistory = () => {
    try {
      const saved = localStorage.getItem('playball_search_history')
      if (saved) {
        searchHistory.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error)
      searchHistory.value = []
    }
  }

  // 清空搜索历史
  const clearSearchHistory = () => {
    searchHistory.value = []
    try {
      localStorage.removeItem('playball_search_history')
    } catch (error) {
      console.error('清空搜索历史失败:', error)
    }
  }

  // 删除单个搜索历史
  const removeFromHistory = (query) => {
    searchHistory.value = searchHistory.value.filter(item => item !== query)
    try {
      localStorage.setItem('playball_search_history', JSON.stringify(searchHistory.value))
    } catch (error) {
      console.error('删除搜索历史失败:', error)
    }
  }

  // 设置搜索查询
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  // 显示/隐藏搜索面板
  const toggleSearchPanel = (show) => {
    showSearchPanel.value = show !== undefined ? show : !showSearchPanel.value
  }

  // 清空搜索
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = { players: [], activities: [], venues: [] }
    searchSuggestions.value = []
  }

  // 初始化
  const initialize = () => {
    loadSearchHistory()
  }

  return {
    // 状态
    searchQuery,
    isSearching,
    showSearchPanel,
    searchHistory,
    searchResults,
    hotSearches,
    searchSuggestions,
    
    // 计算属性
    hasSearchQuery,
    hasSearchResults,
    totalResultsCount,
    
    // 方法
    generateSuggestions,
    performSearch,
    addToHistory,
    loadSearchHistory,
    clearSearchHistory,
    removeFromHistory,
    setSearchQuery,
    toggleSearchPanel,
    clearSearch,
    initialize
  }
})