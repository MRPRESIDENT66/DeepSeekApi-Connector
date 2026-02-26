<template>
  <div class="chat-messages-container">
    <div
      v-for="(message, index) in messages"
      :key="index"
      class="message-container"
      :class="message.role"
    >
      <el-card class="message-card">
        <div class="message-header">
          <strong>{{ message.role === 'user' ? 'User' : 'DeepSeek' }}:</strong>
        </div>
        <div class="message-content" v-html="renderMarkdown(message.content)"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ElCard } from 'element-plus'
import { renderMarkdown } from '@/utils/markdownRenderer'

defineProps({
  messages: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped>
.chat-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f5f5;
}

.message-container {
  max-width: 80%;
  margin: 12px 0;
}

.message-container.user {
  margin-right: auto;
  margin-left: 0;
}

.message-container.assistant {
  margin-right: 0;
}

.message-card {
  border-radius: 8px;
}

.message-header {
  color: #666;
  margin-bottom: 8px;
}

.code-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
