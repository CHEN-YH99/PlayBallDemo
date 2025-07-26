import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user.js'
import { useNotificationStore } from './notificationStore.js'

export const usePublishStore = defineStore('publish', () => {
  // 发布类型枚举
  const PublishType = {
    ACTIVITY: 'activity',     // 活动发布
    MOMENT: 'moment',         // 动态发布
    VENUE: 'venue',          // 场地发布
    RECRUITMENT: 'recruitment' // 招募发布
  }

  // 发布状态
  const publishData = ref({
    type: PublishType.ACTIVITY,
    title: '',
    content: '',
    images: [],
    location: {
      city: '',
      district: '',
      address: '',
      coordinates: null
    },
    activity: {
      sport: '',
      date: '',
      time: '',
      duration: 120, // 分钟
      maxParticipants: 10,
      fee: 0,
      level: 'all', // all, beginner, intermediate, advanced
      equipment: '',
      rules: ''
    },
    venue: {
      name: '',
      facilities: [],
      openHours: '',
      contact: '',
      priceRange: ''
    },
    recruitment: {
      position: '',
      requirements: '',
      salary: '',
      contact: ''
    }
  })

  // 发布状态
  const isPublishing = ref(false)
  const publishHistory = ref([])
  const draftList = ref([])

  // 图片上传状态
  const uploadingImages = ref(false)
  const uploadProgress = ref(0)

  // 计算属性
  const canPublish = computed(() => {
    const data = publishData.value
    const hasTitle = data.title.trim().length > 0
    const hasContent = data.content.trim().length > 0
    const hasLocation = data.location.city && data.location.district

    switch (data.type) {
      case PublishType.ACTIVITY:
        return hasTitle && hasContent && hasLocation && 
               data.activity.sport && data.activity.date && data.activity.time
      case PublishType.MOMENT:
        return hasContent || data.images.length > 0
      case PublishType.VENUE:
        return hasTitle && hasContent && hasLocation && data.venue.name
      case PublishType.RECRUITMENT:
        return hasTitle && hasContent && data.recruitment.position
      default:
        return false
    }
  })

  const publishButtonText = computed(() => {
    if (isPublishing.value) return '发布中...'
    
    switch (publishData.value.type) {
      case PublishType.ACTIVITY:
        return '发布活动'
      case PublishType.MOMENT:
        return '发布动态'
      case PublishType.VENUE:
        return '发布场地'
      case PublishType.RECRUITMENT:
        return '发布招募'
      default:
        return '发布'
    }
  })

  // 重置发布数据
  const resetPublishData = () => {
    publishData.value = {
      type: PublishType.ACTIVITY,
      title: '',
      content: '',
      images: [],
      location: {
        city: '',
        district: '',
        address: '',
        coordinates: null
      },
      activity: {
        sport: '',
        date: '',
        time: '',
        duration: 120,
        maxParticipants: 10,
        fee: 0,
        level: 'all',
        equipment: '',
        rules: ''
      },
      venue: {
        name: '',
        facilities: [],
        openHours: '',
        contact: '',
        priceRange: ''
      },
      recruitment: {
        position: '',
        requirements: '',
        salary: '',
        contact: ''
      }
    }
  }

  // 设置发布类型
  const setPublishType = (type) => {
    publishData.value.type = type
  }

  // 设置位置信息
  const setLocation = (location) => {
    publishData.value.location = { ...publishData.value.location, ...location }
  }

  // 上传图片
  const uploadImages = async (files) => {
    uploadingImages.value = true
    uploadProgress.value = 0

    try {
      const uploadPromises = files.map(async (file, index) => {
        // 模拟上传进度
        const simulateProgress = () => {
          return new Promise((resolve) => {
            let progress = 0
            const interval = setInterval(() => {
              progress += Math.random() * 30
              if (progress >= 100) {
                progress = 100
                clearInterval(interval)
                resolve()
              }
              uploadProgress.value = Math.min(progress, 100)
            }, 100)
          })
        }

        await simulateProgress()

        // 模拟上传结果
        return {
          id: Date.now() + index,
          url: URL.createObjectURL(file),
          originalName: file.name,
          size: file.size,
          type: file.type
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      publishData.value.images.push(...uploadedImages)

      return uploadedImages
    } catch (error) {
      console.error('图片上传失败:', error)
      throw error
    } finally {
      uploadingImages.value = false
      uploadProgress.value = 0
    }
  }

  // 删除图片
  const removeImage = (imageId) => {
    publishData.value.images = publishData.value.images.filter(img => img.id !== imageId)
  }

  // 保存草稿
  const saveDraft = () => {
    const draft = {
      id: Date.now(),
      ...JSON.parse(JSON.stringify(publishData.value)),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    draftList.value.unshift(draft)
    
    // 保存到本地存储
    try {
      localStorage.setItem('publish_drafts', JSON.stringify(draftList.value))
    } catch (error) {
      console.error('保存草稿失败:', error)
    }

    return draft
  }

  // 加载草稿
  const loadDraft = (draftId) => {
    const draft = draftList.value.find(d => d.id === draftId)
    if (draft) {
      publishData.value = { ...draft }
      delete publishData.value.id
      delete publishData.value.createdAt
      delete publishData.value.updatedAt
    }
  }

  // 删除草稿
  const deleteDraft = (draftId) => {
    draftList.value = draftList.value.filter(d => d.id !== draftId)
    
    try {
      localStorage.setItem('publish_drafts', JSON.stringify(draftList.value))
    } catch (error) {
      console.error('删除草稿失败:', error)
    }
  }

  // 发布内容
  const publish = async () => {
    const userStore = useUserStore()
    const notificationStore = useNotificationStore()

    // 检查登录状态
    if (!userStore.isAuthenticated) {
      throw new Error('请先登录')
    }

    // 验证发布数据
    if (!canPublish.value) {
      throw new Error('请完善发布信息')
    }

    isPublishing.value = true

    try {
      // 构建发布数据
      const publishPayload = {
        ...publishData.value,
        authorId: userStore.currentUser.id,
        authorName: userStore.currentUser.nickname || userStore.currentUser.phone,
        authorAvatar: userStore.currentUser.avatar,
        publishTime: new Date(),
        status: 'published'
      }

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 添加到发布历史
      const publishedItem = {
        id: Date.now(),
        ...publishPayload
      }

      publishHistory.value.unshift(publishedItem)

      // 保存到本地存储
      try {
        localStorage.setItem('publish_history', JSON.stringify(publishHistory.value))
      } catch (error) {
        console.error('保存发布历史失败:', error)
      }

      // 发送通知
      notificationStore.addNotification({
        type: 'system',
        title: '发布成功',
        content: `您的${getTypeDisplayName(publishData.value.type)}已成功发布`,
        priority: 'normal',
        icon: 'success'
      })

      // 重置发布数据
      resetPublishData()

      return publishedItem
    } catch (error) {
      console.error('发布失败:', error)
      
      notificationStore.addNotification({
        type: 'system',
        title: '发布失败',
        content: error.message || '发布时出现错误，请重试',
        priority: 'high',
        icon: 'warning-o'
      })
      
      throw error
    } finally {
      isPublishing.value = false
    }
  }

  // 获取类型显示名称
  const getTypeDisplayName = (type) => {
    const typeNames = {
      [PublishType.ACTIVITY]: '活动',
      [PublishType.MOMENT]: '动态',
      [PublishType.VENUE]: '场地',
      [PublishType.RECRUITMENT]: '招募'
    }
    return typeNames[type] || '内容'
  }

  // 加载草稿列表
  const loadDrafts = () => {
    try {
      const saved = localStorage.getItem('publish_drafts')
      if (saved) {
        draftList.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('加载草稿列表失败:', error)
      draftList.value = []
    }
  }

  // 加载发布历史
  const loadPublishHistory = () => {
    try {
      const saved = localStorage.getItem('publish_history')
      if (saved) {
        publishHistory.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('加载发布历史失败:', error)
      publishHistory.value = []
    }
  }

  // 初始化
  const initialize = () => {
    loadDrafts()
    loadPublishHistory()
  }

  return {
    // 枚举
    PublishType,
    
    // 状态
    publishData,
    isPublishing,
    publishHistory,
    draftList,
    uploadingImages,
    uploadProgress,
    
    // 计算属性
    canPublish,
    publishButtonText,
    
    // 方法
    resetPublishData,
    setPublishType,
    setLocation,
    uploadImages,
    removeImage,
    saveDraft,
    loadDraft,
    deleteDraft,
    publish,
    getTypeDisplayName,
    initialize
  }
})