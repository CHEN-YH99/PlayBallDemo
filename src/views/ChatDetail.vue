<template>
  <div class="chat-detail">
    <!-- 自定义头部 -->
    <div class="chat-header">
      <div class="header-left">
        <van-icon name="arrow-left" size="20" @click="goBack" />
      </div>
      <div class="header-center">
        <div class="chat-name">{{ chatInfo.name }}</div>
        <div class="chat-status" v-if="chatInfo.type === 'group'">
          5人在线
        </div>
        <div class="chat-status" v-else>
          在线
        </div>
      </div>
      <div class="header-right">
        <van-icon name="ellipsis" size="20" @click="showChatInfo" />
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list" ref="messageListRef">
      <!-- 日期分隔符 -->
      <van-divider class="date-divider">今天</van-divider>

      <!-- 消息项 -->
      <div v-for="message in messages" :key="message.id" class="message-item">
        <!-- 其他人的消息 -->
        <div v-if="!message.isOwn" class="message-wrapper left">
          <van-image
            :src="message.avatar"
            round
            width="40"
            height="40"
            class="message-avatar"
          />
          <div class="message-content">
            <div class="message-info" v-if="chatInfo.type === 'group'">
              <span class="username">{{ message.username }}</span>
              <span class="time">{{ message.time }}</span>
            </div>
            <div class="message-info" v-else>
              <span class="time">{{ message.time }}</span>
            </div>
            <div class="message-bubble left-bubble">
              {{ message.content }}
            </div>
          </div>
        </div>

        <!-- 自己的消息 -->
        <div v-else class="message-wrapper right">
          <div class="message-content">
            <div class="message-info right-align">
              <span class="time">{{ message.time }}</span>
              <span class="status">已读</span>
            </div>
            <div class="message-bubble right-bubble">
              {{ message.content }}
            </div>
          </div>
          <van-image
            :src="message.avatar"
            round
            width="40"
            height="40"
            class="message-avatar"
          />
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="chat-input-area">
      <div class="chat-input">
        <!-- 输入框 -->
        <div class="input-row">
          <!-- 语音按钮 -->
          <div class="input-btn voice-toggle-btn" @click="toggleVoiceInput">
            <van-icon :name="isVoiceMode ? 'keyboard' : 'volume-o'" size="24" />
          </div>

          <!-- 文字输入 -->
          <div v-if="!isVoiceMode" class="input-wrapper">
            <textarea
              v-model="inputMessage"
              placeholder="输入消息..."
              class="message-input"
              rows="1"
              @input="adjustTextareaHeight"
              @keydown.enter.exact.prevent="sendMessage"
            />
          </div>

          <!-- 语音输入 -->
          <div v-else class="voice-wrapper">
            <div
              class="voice-button"
              :class="{ recording: isRecording }"
              @touchstart="startVoiceRecord"
              @touchend="stopVoiceRecord"
            >
              {{ isRecording ? '松开发送' : '按住说话' }}
            </div>
          </div>

          <!-- 表情按钮 -->
          <div class="input-btn emoji-btn" @click="showEmojiPanel">
            <van-icon name="smile-o" size="24" />
          </div>

          <!-- 更多功能按钮或发送按钮 -->
          <div v-if="!inputMessage.trim()" class="input-btn more-btn" @click="showMoreOptions">
            <van-icon name="plus" size="24" />
          </div>
          <div v-else class="send-button" @click="sendMessage">
            发送
          </div>
        </div>
      </div>
    </div>

    <!-- 更多功能选项 -->
    <van-action-sheet
      v-model:show="showMoreSheet"
      :actions="moreActions"
      @select="handleMoreAction"
      cancel-text="取消"
    />

    <!-- 聊天信息弹窗 -->
    <van-popup v-model:show="showInfoPopup" position="right" style="width: 80%; height: 100%;">
      <div class="chat-info-panel">
        <van-nav-bar title="聊天信息" left-arrow @click-left="showInfoPopup = false" />
        <van-cell-group>
          <van-cell title="聊天名称" :value="chatInfo.name" />
          <van-cell v-if="chatInfo.type === 'group'" title="群成员" value="5人" is-link />
          <van-cell title="查找聊天记录" is-link />
          <van-cell title="消息免打扰" is-link>
            <template #right-icon>
              <van-switch v-model="muteNotification" size="20" />
            </template>
          </van-cell>
          <van-cell title="置顶聊天" is-link>
            <template #right-icon>
              <van-switch v-model="pinChat" size="20" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()

// 页面状态
const inputMessage = ref('')
const isVoiceMode = ref(false)
const isRecording = ref(false)
const showInfoPopup = ref(false)
const showMoreSheet = ref(false)
const messageListRef = ref(null)
const muteNotification = ref(false)
const pinChat = ref(false)

// 聊天信息
const chatInfo = ref({
  id: route.params.id || '1',
  name: route.query.name || '篮球群聊',
  avatar: route.query.avatar || 'https://img.yzcdn.cn/vant/cat.jpeg',
  type: route.query.type || 'group'
})

// 更多功能选项
const moreActions = [
  { name: 'image', text: '图片', icon: 'photograph' },
  { name: 'location', text: '位置', icon: 'location-o' },
  { name: 'file', text: '文件', icon: 'description' }
]

// 根据聊天类型生成不同的消息数据
const getMessagesForChat = (chatId, chatType) => {
  const baseMessages = {
    '1': [ // 篮球群聊
      {
        id: 1,
        username: 'Mike',
        content: '19:00开始打球，大家准时到场',
        time: '14:32',
        avatar: 'https://img.yzcdn.cn/vant/cat.jpeg',
        isOwn: false
      },
      {
        id: 2,
        username: '志明',
        content: '收到！我会准时到的',
        time: '14:35',
        avatar: 'https://img.yzcdn.cn/vant/apple-1.jpg',
        isOwn: false
      },
      {
        id: 3,
        username: '我',
        content: '好的，我也会准时到场',
        time: '14:36',
        avatar: 'https://img.yzcdn.cn/vant/apple-2.jpg',
        isOwn: true
      }
    ],
    '2': [ // 小明私聊
      {
        id: 1,
        username: '小明',
        content: '明天一起打羽毛球吗？',
        time: '14:30',
        avatar: 'https://img.yzcdn.cn/vant/apple-1.jpg',
        isOwn: false
      },
      {
        id: 2,
        username: '我',
        content: '好啊，几点开始？',
        time: '14:32',
        avatar: 'https://img.yzcdn.cn/vant/apple-2.jpg',
        isOwn: true
      },
      {
        id: 3,
        username: '小明',
        content: '下午3点怎么样？',
        time: '14:33',
        avatar: 'https://img.yzcdn.cn/vant/apple-1.jpg',
        isOwn: false
      }
    ],
    '3': [ // 足球爱好者群聊
      {
        id: 1,
        username: '队长',
        content: '周末足球比赛报名开始了',
        time: '10:00',
        avatar: 'https://img.yzcdn.cn/vant/apple-2.jpg',
        isOwn: false
      },
      {
        id: 2,
        username: '小李',
        content: '我报名参加！',
        time: '10:05',
        avatar: 'https://img.yzcdn.cn/vant/apple-3.jpg',
        isOwn: false
      }
    ],
    '4': [ // 小红私聊
      {
        id: 1,
        username: '小红',
        content: '今天的训练怎么样？',
        time: '18:00',
        avatar: 'https://img.yzcdn.cn/vant/apple-3.jpg',
        isOwn: false
      },
      {
        id: 2,
        username: '我',
        content: '还不错，进步了不少',
        time: '18:02',
        avatar: 'https://img.yzcdn.cn/vant/apple-2.jpg',
        isOwn: true
      }
    ],
    '5': [ // 网球俱乐部群聊
      {
        id: 1,
        username: '教练',
        content: '周末活动安排已发布，请大家查看',
        time: '09:00',
        avatar: 'https://img.yzcdn.cn/vant/apple-4.jpg',
        isOwn: false
      },
      {
        id: 2,
        username: '我',
        content: '收到，谢谢教练',
        time: '09:05',
        avatar: 'https://img.yzcdn.cn/vant/apple-2.jpg',
        isOwn: true
      }
    ]
  }
  
  return baseMessages[chatId] || []
}

// 消息数据
const messages = ref(getMessagesForChat(chatInfo.value.id, chatInfo.value.type))

// 计算属性
const canSend = computed(() => {
  return inputMessage.value.trim() || isVoiceMode.value
})

// 方法
const goBack = () => {
  // 优先返回到消息页面，如果没有历史记录则直接跳转
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/message')
  }
}

const showChatInfo = () => {
  showInfoPopup.value = true
}

const toggleVoiceInput = () => {
  isVoiceMode.value = !isVoiceMode.value
  if (isVoiceMode.value) {
    inputMessage.value = ''
  }
}

const showMoreOptions = () => {
  showMoreSheet.value = true
}

const showEmojiPanel = () => {
  showToast('表情面板')
}

const adjustTextareaHeight = (event) => {
  const textarea = event.target
  textarea.style.height = 'auto'
  const scrollHeight = textarea.scrollHeight
  const maxHeight = 120 // 最大高度
  textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px'
}

const handleMoreAction = (action) => {
  switch (action.name) {
    case 'image':
      showToast('选择图片')
      break
    case 'location':
      showToast('分享位置')
      break
    case 'file':
      showToast('选择文件')
      break
  }
}

const startVoiceRecord = () => {
  if (isVoiceMode.value) {
    isRecording.value = true
    showToast('开始录音')
  }
}

const stopVoiceRecord = () => {
  if (isRecording.value) {
    isRecording.value = false
    // 发送语音消息
    const voiceMessage = {
      id: Date.now(),
      username: '我',
      content: '[语音消息]',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://img.yzcdn.cn/vant/apple-2.jpg',
      isOwn: true,
      type: 'voice'
    }
    messages.value.push(voiceMessage)
    scrollToBottom()
  }
}

const sendMessage = () => {
  if (!inputMessage.value.trim() && !isVoiceMode.value) return

  if (isVoiceMode.value) {
    startVoiceRecord()
    return
  }

  const newMessage = {
    id: Date.now(),
    username: '我',
    content: inputMessage.value,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: 'https://img.yzcdn.cn/vant/apple-2.jpg',
    isOwn: true
  }

  messages.value.push(newMessage)
  inputMessage.value = ''

  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style lang="scss" scoped>
.chat-detail {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ededed;
  position: relative;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  background: #f7f7f7;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 16px;
  position: relative;
  z-index: 100;
  
  .header-left, .header-right {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    
    &:active {
      background: rgba(0, 0, 0, 0.05);
    }
  }
  
  .header-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .chat-name {
      font-size: 17px;
      font-weight: 500;
      color: #000;
      line-height: 1.2;
    }
    
    .chat-status {
      font-size: 12px;
      color: #888;
      margin-top: 2px;
    }
  }
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: 16px;
}

.date-divider {
  margin: 20px 0;
  text-align: center;

  :deep(.van-divider__content) {
    background: rgba(0, 0, 0, 0.1);
    color: #999;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
  }
}

.message-item {
  margin-bottom: 20px;
}

.message-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  &.left {
    justify-content: flex-start;
  }

  &.right {
    justify-content: flex-end;
    flex-direction: row-reverse;
  }

  .message-avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
  }

  .message-content {
    max-width: calc(100% - 80px);
    min-width: 0;
  }

  .message-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    font-size: 12px;
    color: #999;

    &.right-align {
      justify-content: flex-end;
    }

    .username {
      font-weight: normal;
      color: #999;
    }

    .status {
      color: #999;
    }
  }

  .message-bubble {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 16px;
    line-height: 1.4;
    word-wrap: break-word;
    display: inline-block;
    position: relative;

    &.left-bubble {
      background: #ffffff;
      color: #000;
      border-top-left-radius: 2px;
      
      &::before {
        content: '';
        position: absolute;
        left: -8px;
        top: 8px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6px 8px 6px 0;
        border-color: transparent #ffffff transparent transparent;
      }
    }

    &.right-bubble {
      background: #95ec69;
      color: #000;
      border-top-right-radius: 2px;
      
      &::before {
        content: '';
        position: absolute;
        right: -8px;
        top: 8px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 6px 0 6px 8px;
        border-color: transparent transparent transparent #95ec69;
      }
    }
  }
}

.chat-input-area {
  background: #f7f7f7;
  border-top: 1px solid #e5e5e5;
  padding: 8px 16px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
}

.chat-input {
  background: #f7f7f7;
}

.input-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.input-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  flex-shrink: 0;
  
  &:active {
    background: rgba(0, 0, 0, 0.05);
  }
}

.input-wrapper {
  flex: 1;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 8px 12px;
  min-height: 36px;
  display: flex;
  align-items: center;
}

.message-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  line-height: 1.4;
  resize: none;
  min-height: 20px;
  max-height: 120px;
  font-family: inherit;
  
  &::placeholder {
    color: #999;
  }
}

.voice-wrapper {
  flex: 1;
}

.voice-button {
  width: 100%;
  height: 36px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #000;
  cursor: pointer;
  user-select: none;

  &.recording {
    background: #ff4444;
    color: #ffffff;
    border-color: #ff4444;
  }

  &:active {
    transform: scale(0.98);
  }
}

.send-button {
  width: 60px;
  height: 36px;
  background: #07c160;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:active {
    background: #06ad56;
    transform: scale(0.98);
  }
}

// 适配安全区域
@supports (padding: max(0px)) {
  .chat-input-area {
    padding-bottom: max(8px, env(safe-area-inset-bottom));
  }
}
</style>