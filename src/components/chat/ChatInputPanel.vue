<template>
  <div class="deepseek-chat-container">
    <div class="ds-input-wrapper">
      <div class="ds-action-bar">
        <div class="mode-group">
          <button class="mode-chip" :class="{ active: !isActive }" type="button" @click="!isActive || onChangeModel()">
            Chat
          </button>
          <button class="mode-chip" :class="{ active: isActive }" type="button" @click="isActive || onChangeModel()">
            Reasoner
          </button>
        </div>

        <p class="ds-hint">
          {{ isActive ? 'Slower, more structured reasoning' : 'Fast replies for normal conversation' }}
        </p>
      </div>

      <div class="ds-input-core">
        <el-input
          :model-value="userInput"
          type="textarea"
          :rows="1"
          resize="none"
          placeholder="Message DeepSeek..."
          class="ds-textarea"
          :autosize="{ minRows: 4, maxRows: 10 }"
          @update:model-value="$emit('update:userInput', $event)"
          @keydown.enter.prevent="onEnter"
          @compositionstart="$emit('compositionstart')"
          @compositionend="$emit('compositionend')"
        />

        <button class="ds-send-btn" type="button" :disabled="isLoading" @click="onSend">
          <span>{{ isLoading ? 'Working' : 'Send' }}</span>
          <el-icon v-if="!isLoading" :size="17"><Top /></el-icon>
          <span v-else class="spinner"></span>
        </button>
      </div>

      <div class="ds-footer">
        <span>Enter to send</span>
        <span>Shift + Enter for line break</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElInput, ElIcon } from 'element-plus'
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
  isLoading: {
    type: Boolean,
    default: false,
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
.deepseek-chat-container {
  padding: 14px 18px 18px;
  background:
    linear-gradient(180deg, rgba(242, 246, 251, 0) 0%, rgba(242, 246, 251, 0.92) 18%);
}

.ds-input-wrapper {
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(111, 128, 152, 0.14);
  box-shadow: 0 16px 36px rgba(29, 50, 80, 0.08);
}

.ds-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.mode-group {
  display: inline-flex;
  gap: 6px;
  padding: 4px;
  border-radius: 999px;
  background: #eef3f9;
}

.mode-chip {
  min-width: 86px;
  padding: 8px 12px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #678;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 160ms ease;
}

.mode-chip.active {
  background: linear-gradient(135deg, #183153 0%, #2f67a9 100%);
  color: #f7fbff;
  box-shadow: 0 10px 22px rgba(31, 64, 108, 0.18);
}

.ds-hint {
  margin: 0;
  font-size: 12px;
  color: #7487a0;
}

.ds-input-core {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: end;
}

:deep(.ds-textarea) {
  display: block;
  width: 100%;
}

:deep(.ds-textarea .el-textarea) {
  display: block;
  width: 100%;
}

:deep(.ds-textarea .el-textarea__inner) {
  border: 0;
  width: 100%;
  min-height: 140px;
  padding: 18px 20px;
  border-radius: 22px;
  background: #f3f7fb;
  box-shadow: inset 0 0 0 1px rgba(111, 128, 152, 0.12);
  color: #1b2c43;
  font-size: 16px;
  line-height: 1.7;
}

:deep(.ds-textarea .el-textarea__inner:focus) {
  background: #ffffff;
  box-shadow:
    inset 0 0 0 1px rgba(63, 136, 197, 0.2),
    0 0 0 4px rgba(63, 136, 197, 0.1);
}

:deep(.ds-textarea .el-textarea__inner::placeholder) {
  color: #91a0b4;
}

.ds-send-btn {
  height: 58px;
  min-width: 132px;
  padding: 0 22px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(135deg, #132b49 0%, #2d67ab 100%);
  color: #f8fbff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 16px 30px rgba(33, 65, 107, 0.2);
  transition: transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
}

.ds-send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 18px 34px rgba(33, 65, 107, 0.26);
}

.ds-send-btn:disabled {
  opacity: 0.72;
  cursor: wait;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(248, 251, 255, 0.28);
  border-top-color: #f8fbff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.ds-footer {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 10px;
  padding: 0 4px;
  font-size: 12px;
  color: #7d8ea6;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 760px) {
  .deepseek-chat-container {
    padding: 10px 12px 12px;
  }

  .ds-action-bar,
  .ds-input-core {
    display: grid;
    grid-template-columns: 1fr;
  }

  .mode-group,
  .ds-send-btn {
    width: 100%;
  }
}
</style>
