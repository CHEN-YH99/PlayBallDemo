<template>
  <van-dialog
    v-model:show="showDialog"
    title="确认退出"
    :message="message"
    show-cancel-button
    :confirm-button-text="confirmText"
    :cancel-button-text="cancelText"
    confirm-button-color="#ee0a24"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <template #message>
      <div class="logout-message">
        <van-icon name="warning-o" size="24" color="#ff976a" />
        <p>{{ message }}</p>
        <div class="logout-tips" v-if="showTips">
          <p>退出后将清除以下数据：</p>
          <ul>
            <li>登录状态</li>
            <li>个人设置</li>
            <li>缓存数据</li>
          </ul>
        </div>
      </div>
    </template>
  </van-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: '确定要退出登录吗？'
  },
  confirmText: {
    type: String,
    default: '确定退出'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  showTips: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

// 计算属性
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// 方法
const handleConfirm = () => {
  emit('confirm');
  showDialog.value = false;
};

const handleCancel = () => {
  emit('cancel');
  showDialog.value = false;
};
</script>

<style lang="scss" scoped>
.logout-message {
  text-align: center;
  padding: 16px 0;
  
  .van-icon {
    margin-bottom: 12px;
  }
  
  p {
    margin: 8px 0;
    color: #646566;
    font-size: 14px;
    line-height: 1.5;
  }
  
  .logout-tips {
    margin-top: 16px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 8px;
    text-align: left;
    
    p {
      margin: 0 0 8px 0;
      font-size: 13px;
      color: #969799;
    }
    
    ul {
      margin: 0;
      padding-left: 16px;
      
      li {
        font-size: 12px;
        color: #969799;
        line-height: 1.6;
      }
    }
  }
}
</style>