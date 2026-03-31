<template>
  <section class="chat-messages-container">
    <div v-if="!messages.length" class="empty-state">
      <p class="empty-kicker">Ready when you are</p>
      <h2>Ask something precise, paste code, or use this as a thinking surface.</h2>
      <div class="starter-grid">
        <div class="starter-card">
          <span>01</span>
          Refactor this Vue component and explain the tradeoffs.
        </div>
        <div class="starter-card">
          <span>02</span>
          Turn these rough notes into a clean technical brief.
        </div>
        <div class="starter-card">
          <span>03</span>
          Compare two implementation options with risks and rollout steps.
        </div>
      </div>
    </div>

    <article
      v-for="(message, index) in messages"
      :key="index"
      class="message-row"
      :class="message.role"
    >
      <div class="message-header">
        <div class="avatar">{{ message.role === 'user' ? 'U' : 'D' }}</div>
        <div>
          <p class="speaker">{{ message.role === 'user' ? 'You' : 'DeepSeek' }}</p>
          <p class="role-label">{{ message.role === 'user' ? 'Prompt' : 'Answer' }}</p>
        </div>
      </div>

      <div class="message-card" :class="message.role">
        <div class="message-content" v-html="renderMarkdown(message.content)"></div>
      </div>
    </article>

    <article v-if="isLoading" class="message-row assistant">
      <div class="message-header">
        <div class="avatar">D</div>
        <div>
          <p class="speaker">DeepSeek</p>
          <p class="role-label">Thinking</p>
        </div>
      </div>

      <div class="message-card assistant loading-card">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </article>
  </section>
</template>

<script setup>
import { renderMarkdown } from '@/utils/markdownRenderer'

defineProps({
  messages: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.chat-messages-container {
  min-height: 0;
  overflow-y: auto;
  padding: 26px 22px 10px;
  background:
    radial-gradient(circle at top right, rgba(205, 225, 244, 0.5), transparent 24%),
    linear-gradient(180deg, rgba(250, 252, 255, 0.9), rgba(244, 248, 252, 0.84));
}

.empty-state {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  max-width: 760px;
  margin: 0 auto;
  padding: 28px 0 72px;
}

.empty-kicker {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6f8098;
}

.empty-state h2 {
  margin: 0;
  font-family: 'Iowan Old Style', 'Palatino Linotype', serif;
  font-size: clamp(2rem, 3vw, 3.4rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: #17253a;
}

.starter-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.starter-card {
  min-height: 132px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(111, 128, 152, 0.12);
  color: #31445d;
  font-size: 15px;
  line-height: 1.55;
  box-shadow: 0 18px 34px rgba(32, 51, 77, 0.06);
}

.starter-card span {
  display: block;
  margin-bottom: 18px;
  font-size: 12px;
  color: #7a8dab;
}

.message-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 860px;
  margin-bottom: 24px;
  animation: rise-in 240ms ease;
}

.message-row.user {
  align-items: flex-end;
  margin-left: auto;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 6px;
}

.message-row.user .message-header {
  justify-content: flex-end;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #183153, #3f88c5);
  color: #f7fbff;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 12px 24px rgba(28, 58, 96, 0.18);
}

.speaker,
.role-label {
  margin: 0;
}

.speaker {
  font-size: 13px;
  font-weight: 600;
  color: #213450;
}

.role-label {
  font-size: 11px;
  color: #7a8dab;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.message-card {
  width: fit-content;
  max-width: min(100%, 860px);
  border-radius: 26px;
  padding: 18px 20px;
  border: 1px solid rgba(111, 128, 152, 0.12);
  box-shadow: 0 18px 30px rgba(36, 56, 87, 0.06);
}

.message-card.assistant {
  width: min(100%, 860px);
  background: rgba(255, 255, 255, 0.94);
  color: #1d2b40;
}

.message-card.user {
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.18), transparent 24%),
    linear-gradient(135deg, #1b375d 0%, #2c5f9e 100%);
  color: #f4f9ff;
}

.message-content {
  font-size: 15px;
  line-height: 1.75;
}

.message-content :deep(p:first-child) {
  margin-top: 0;
}

.message-content :deep(p:last-child) {
  margin-bottom: 0;
}

.loading-card {
  display: inline-flex;
  gap: 8px;
  width: fit-content;
}

.loading-card span {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #4d7aac;
  animation: pulse 1.1s ease-in-out infinite;
}

.loading-card span:nth-child(2) {
  animation-delay: 0.15s;
}

.loading-card span:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes pulse {
  0%,
  80%,
  100% {
    opacity: 0.3;
    transform: translateY(0);
  }

  40% {
    opacity: 1;
    transform: translateY(-4px);
  }
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 760px) {
  .chat-messages-container {
    padding: 18px 12px 8px;
  }

  .starter-grid {
    grid-template-columns: 1fr;
  }

  .message-row {
    max-width: 100%;
  }
}
</style>
