<template>
  <div id="app">
    <el-container style="height: 100vh; display: flex; flex-direction: column;">
      <el-main style="flex: 1; display: flex; flex-direction: column;" ref="mainContainer">
        <ChatMessages :messages="messages" />
        <ChatInputPanel
          :user-input="userInput"
          :is-active="isActive"
          @update:user-input="userInput = $event"
          @change-model="changeModel"
          @enter="handleEnter"
          @send="sendMessage"
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
        />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ElContainer, ElMain } from 'element-plus'
import { onMounted } from 'vue'
import ChatInputPanel from '@/components/chat/ChatInputPanel.vue'
import ChatMessages from '@/components/chat/ChatMessages.vue'
import { initCopyButtons } from '@/utils/markdownRenderer'
import { useChat } from '@/composables/useChat'

const {
  userInput,
  messages,
  isActive,
  isComposing,
  changeModel,
  handleEnter,
  sendMessage,
} = useChat()

onMounted(() => {
  initCopyButtons()
})
</script>
