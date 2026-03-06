<template>
  <div id="app" class="app-shell">
    <div class="app-noise"></div>

    <main class="workspace">
      <header class="topbar">
        <div class="brand-block">
          <p class="brand-kicker">DeepSeek Workspace</p>
          <h1>Refined chat, not a landing page.</h1>
        </div>

        <div class="topbar-meta">
          <span class="meta-pill">Markdown ready</span>
          <span class="meta-pill">{{ isActive ? 'Reasoner mode' : 'Chat mode' }}</span>
        </div>
      </header>

      <section class="chat-frame" ref="mainContainer">
        <div class="chat-frame__header">
          <div>
            <p class="section-label">Session</p>
            <p class="section-title">DeepSeek Console</p>
          </div>
          <div class="session-state">
            <span class="state-dot"></span>
            {{ isLoading ? 'Generating response' : 'Ready' }}
          </div>
        </div>

        <ChatMessages :messages="messages" :is-loading="isLoading" />

        <ChatInputPanel
          :user-input="userInput"
          :is-active="isActive"
          :is-loading="isLoading"
          @update:user-input="userInput = $event"
          @change-model="changeModel"
          @enter="handleEnter"
          @send="sendMessage"
          @compositionstart="isComposing = true"
          @compositionend="isComposing = false"
        />
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ChatInputPanel from '@/components/chat/ChatInputPanel.vue'
import ChatMessages from '@/components/chat/ChatMessages.vue'
import { initCopyButtons } from '@/utils/markdownRenderer'
import { useChat } from '@/composables/useChat'

const {
  userInput,
  messages,
  isActive,
  isLoading,
  isComposing,
  changeModel,
  handleEnter,
  sendMessage,
} = useChat()

onMounted(() => {
  initCopyButtons()
})
</script>

<style scoped>
:global(body) {
  margin: 0;
  font-family: 'Avenir Next', 'Segoe UI', sans-serif;
  background:
    radial-gradient(circle at top left, rgba(210, 229, 244, 0.9), transparent 28%),
    radial-gradient(circle at bottom right, rgba(231, 210, 184, 0.65), transparent 26%),
    linear-gradient(180deg, #f5f7fb 0%, #edf1f6 100%);
  color: #132033;
}

:global(*) {
  box-sizing: border-box;
}

.app-shell {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.app-noise {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.28) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.22) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.34), transparent 88%);
  pointer-events: none;
}

.workspace {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  width: min(1440px, calc(100vw - 24px));
  margin: 0 auto;
  padding: 18px 12px 12px;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 12px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
}

.brand-kicker,
.section-label {
  margin: 0 0 6px;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6f8098;
}

.brand-block h1 {
  margin: 0;
  font-family: 'Iowan Old Style', 'Palatino Linotype', serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 0.98;
  font-weight: 600;
  letter-spacing: -0.04em;
  color: #18263b;
}

.topbar-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.meta-pill,
.session-state {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(91, 121, 158, 0.12);
  color: #30445f;
  font-size: 13px;
  backdrop-filter: blur(12px);
}

.chat-frame {
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  border-radius: 30px;
  overflow: hidden;
  background: rgba(252, 253, 255, 0.84);
  border: 1px solid rgba(111, 128, 152, 0.16);
  box-shadow:
    0 30px 80px rgba(27, 44, 73, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(18px);
}

.chat-frame__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(111, 128, 152, 0.12);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(244, 247, 252, 0.62));
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #17253a;
}

.state-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3f88c5;
  box-shadow: 0 0 0 6px rgba(63, 136, 197, 0.12);
}

@media (max-width: 760px) {
  .workspace {
    padding: 12px;
  }

  .topbar,
  .chat-frame__header {
    align-items: start;
    flex-direction: column;
  }

  .brand-block h1 {
    font-size: 2.2rem;
  }
}
</style>
