<template>
  <van-nav-bar 
    :title="title" 
    :left-arrow="showBack"
    :right-text="rightText"
    :fixed="fixed"
    :placeholder="placeholder"
    :border="border"
    :z-index="zIndex"
    @click-left="handleBack"
    @click-right="handleRightClick"
  >
    <!-- 左侧插槽 -->
    <template #left v-if="$slots.left">
      <slot name="left"></slot>
    </template>
    
    <!-- 标题插槽 -->
    <template #title v-if="$slots.title">
      <slot name="title"></slot>
    </template>
    
    <!-- 右侧插槽 -->
    <template #right v-if="$slots.right">
      <slot name="right"></slot>
    </template>
  </van-nav-bar>
</template>

<script setup>
import { useRouter } from 'vue-router';

// Props
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 是否显示返回按钮
  showBack: {
    type: Boolean,
    default: true
  },
  // 右侧文字
  rightText: {
    type: String,
    default: ''
  },
  // 是否固定在顶部
  fixed: {
    type: Boolean,
    default: true
  },
  // 是否显示占位元素
  placeholder: {
    type: Boolean,
    default: true
  },
  // 是否显示下边框
  border: {
    type: Boolean,
    default: true
  },
  // 层级
  zIndex: {
    type: [Number, String],
    default: 1
  },
  // 自定义返回行为
  customBack: {
    type: Function,
    default: null
  }
});

// Emits
const emit = defineEmits(['back', 'right-click']);

const router = useRouter();

// 处理返回
const handleBack = () => {
  if (props.customBack) {
    props.customBack();
  } else {
    emit('back');
    router.back();
  }
};

// 处理右侧点击
const handleRightClick = () => {
  emit('right-click');
};
</script>

<style lang="scss" scoped>
// 可以在这里添加自定义样式
</style>