<template>
  <div class="deepseek-chat-container">
    <div class="ds-input-wrapper">
      <div class="ds-action-bar">
        <el-button class="ds-mode-btn" :class="{ 'active-mode': isActive }" type="text" @click="onChangeModel">
          <span class="ds-mode-icon">🎯</span>
          Deep Thinking (R1)
        </el-button>
        <el-divider direction="vertical" />
      </div>

      <div class="ds-input-core">
        <el-input
          :model-value="userInput"
          type="textarea"
          :rows="1"
          resize="none"
          placeholder="Send a message to DeepSeek"
          class="ds-textarea"
          @update:model-value="$emit('update:userInput', $event)"
          @keydown.enter.prevent="onEnter"
          @compositionstart="$emit('compositionstart')"
          @compositionend="$emit('compositionend')"
        />

        <div class="ds-action-group">
          <el-button class="ds-send-btn" @click="onSend">
            <el-icon :size="20"><Top /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElButton, ElDivider, ElInput, ElIcon } from 'element-plus'
import { Top } from '@element-plus/icons-vue'

defineProps({
  userInput: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits([
  'update:userInput',
  'change-model',
  'enter',
  'send',
  'compositionstart',
  'compositionend',
])

const onChangeModel = () => emit('change-model')
const onEnter = (event) => emit('enter', event)
const onSend = () => emit('send')
</script>

<style scoped>
.ds-input-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 12px;
  transition: all 0.3s ease;
  position: relative;
}

.ds-action-bar {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
}

.ds-mode-btn {
  padding: 4px 12px !important;
  height: auto !important;
  border-radius: 8px !important;
  background: #f8f9fa !important;
  color: #4b5563 !important;
  transition: all 0.2s !important;
}

.ds-mode-btn.active-mode {
  color: #007aff !important;
  background: #daeeff !important;
}

.ds-mode-btn:hover {
  background: #f1f5f9 !important;
  transform: translateY(-1px);
}

.ds-mode-icon {
  margin-right: 6px;
  font-size: 14px;
}

.ds-input-core {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

:deep(.ds-textarea .el-textarea__inner) {
  border: none !important;
  background: #f8f9fa !important;
  border-radius: 12px !important;
  padding: 12px 16px !important;
  min-height: 48px !important;
  line-height: 1.5 !important;
  font-size: 14px !important;
  color: #1f2937 !important;
  box-shadow: none !important;
  transition: all 0.3s ease !important;
  width: 1100px !important;
  height: 98px !important;
}

:deep(.ds-textarea .el-textarea__inner:focus) {
  background: #ffffff !important;
  box-shadow: 0 0 0 2px #007aff33 !important;
}

:deep(.ds-textarea .el-textarea__inner::placeholder) {
  color: #9ca3af !important;
}

.ds-send-btn {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  background: #007aff !important;
  color: white !important;
  transition: all 0.2s !important;
  border: none !important;
}

.ds-send-btn :deep(.el-icon) {
  font-size: 22px !important;
  transform: translateY(1px);
}

.ds-send-btn:hover:not(:disabled) {
  background: #0063cc !important;
  transform: scale(1.05);
}

.ds-send-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.ds-send-btn:disabled {
  background: #e5e7eb !important;
  color: #9ca3af !important;
  cursor: not-allowed;
}

.ds-input-wrapper:focus-within {
  border-color: #007aff;
  box-shadow: 0 0 0 3px #007aff1a;
}
</style>
