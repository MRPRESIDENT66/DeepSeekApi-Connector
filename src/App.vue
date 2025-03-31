<template>
  <div id="app">
    <el-container style="height: 100vh; display: flex; flex-direction: column;">

      <!-- Chat Container -->
      <el-main style="flex: 1; display: flex; flex-direction: column;" ref="mainContainer" >
        <div style="flex: 1; overflow-y: auto; padding: 20px; background: #f5f5f5;">
          <div
              v-for="(message, index) in messages"
              :key="index"
              class="message-container"
              :class="message.role"
          >
            <el-card class="message-card">
              <!-- 保留角色显示 -->
              <div class="message-header">
                <strong>{{ message.role === 'user' ? '用户' : 'DeepSeek' }}:</strong>
              </div>
              <div
                  class="message-content"
                  v-html="renderMarkdown(message.content)"
              ></div>
            </el-card>
          </div>
        </div>
        <div class="deepseek-chat-container">
          <!-- 输入区域 -->
          <div class="ds-input-wrapper">
            <!-- 功能按钮行 -->
            <div class="ds-action-bar">
              <el-button class="ds-mode-btn" :class="{ 'active-mode': isActive }" type="text" @click="ChangeModel">
                <span class="ds-mode-icon">🎯</span>
                深度思考 (R1)
              </el-button>
              <el-divider direction="vertical" />
<!--              <el-button class="ds-mode-btn" type="text">-->
<!--                <span class="ds-mode-icon">🌐</span>-->
<!--                联网搜索-->
<!--              </el-button>-->
            </div>

            <!-- 输入核心区域 -->
            <div class="ds-input-core">
              <!-- 文本输入区 -->
              <el-input
                  v-model="userInput"
                  type="textarea"
                  :rows="1"
                  resize="none"
                  placeholder="给 DeepSeek 发送消息"
                  class="ds-textarea"
                  @keydown.enter.prevent="handleEnter"
                  @compositionstart="isComposing = true"
                  @compositionend="isComposing = false"
              />

              <!-- 操作按钮组 -->
              <div class="ds-action-group">
<!--                <el-button class="ds-attach-btn">-->
<!--                  <el-icon :size="18"><Paperclip /></el-icon>-->
<!--                </el-button>-->
                <el-button
                    class="ds-send-btn"
                    @click="sendMessage"
                >
                  <el-icon :size="20"><Top /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ElContainer, ElMain, ElInput, ElCard,ElButton } from 'element-plus';
import OpenAI from "openai";
import { ref} from "vue";
import { Top } from "@element-plus/icons-vue";
import { onMounted } from 'vue'
import { renderMarkdown, initCopyButtons } from '@/utils/markdownRenderer'


onMounted(() => {
  initCopyButtons() // 初始化复制功能
})



/**************************************************************
 * 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
 *                ⚠️⚠️ 重要代码修改提醒 ⚠️⚠️
 *                此处的api换成自己申请的apiKey
 **************************************************************/
let api = '  '     // 临时Key，必须替换！
/**************************************************************
 *
 * 🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
 **************************************************************/


const userInput = ref("");
const messages = ref([]);
const isActive = ref(false)
const isComposing = ref(false)
const lastKeyWasCompositionEnd = ref(false)


const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com', // 使用 DeepSeek API 地址
  apiKey: api, // 你的 DeepSeek API 密钥
  dangerouslyAllowBrowser: true,
});

const ChangeModel = () => {
  isActive.value = !isActive.value
}

const handleEnter = (event) => {
  // 关键检测逻辑（适配您提供的event结构）
  const isRealEnter = !isComposing.value &&
      !lastKeyWasCompositionEnd.value &&
      event.keyCode === 13

  if (isRealEnter && !event.shiftKey) {
    sendMessage()
  }

  // 重置标记（防止compositionend后的第一个Enter被误判）
  lastKeyWasCompositionEnd.value = false
}

const sendMessage = async()=> {
  if (!userInput.value.trim) return;
  messages.value.push({role: 'user', content: userInput.value});
  userInput.value = '';
  try {
    const response = await openai.chat.completions.create({
      messages: messages.value, // 传递当前的消息
      model: isActive.value?'deepseek-reasoner':'deepseek-chat' // 使用 DeepSeek 的聊天模型
    });

    messages.value.push({role:response.choices[0].message.role,
                        content:response.choices[0].message.content})

  } catch (err) {
    messages.value.push({ role: "assistant", content: "抱歉，出错了！" });
  }
};
</script>

<style scoped>
.message-container {
  max-width: 80%;
  margin: 12px 0;
}

/* 用户消息靠左 */
.message-container.user {
  margin-right: auto;
  margin-left: 0;
}

/* 助手消息靠右 */
.message-container.assistant {
  margin-right: 0;
}

/* 卡片样式保持原样 */
.message-card {
  border-radius: 8px;
}

.message-header {
  color: #666;
  margin-bottom: 8px;
}

/* 代码块复制按钮位置修正 */
.code-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ds-input-wrapper {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 12px;
  transition: all 0.3s ease;
  position: relative;
}

/* 功能按钮行 */
.ds-action-bar {
  display: flex;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
}

/* 模式选择按钮 */
  .ds-mode-btn {
    padding: 4px 12px !important;
    height: auto !important;
    border-radius: 8px !important;
    background: #f8f9fa !important;
    color: #4b5563 !important;
    transition: all 0.2s !important;
  }
  .ds-mode-btn.active-mode {
    color: #007AFF !important; /* 激活时文字变蓝 */
    background: #daeeff !important; /* 浅蓝色背景 */
  }

  &:hover {
    background: #f1f5f9 !important;
    transform: translateY(-1px);
  }

.ds-mode-icon {
  margin-right: 6px;
  font-size: 14px;
}

/* 输入核心区域 */
.ds-input-core {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

/* 文本输入框深度定制 */
:deep(.ds-textarea) {
  .el-textarea__inner {
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
    width: 900px !important;
    height: 98px !important;

    &:focus {
      background: #ffffff !important;
      box-shadow: 0 0 0 2px #007AFF33 !important;
    }

    &::placeholder {
      color: #9ca3af !important;
    }
  }
}
/* 发送按钮 */
.ds-send-btn {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  background: #007AFF !important;
  color: white !important;
  transition: all 0.2s !important;
  border: none !important;

  :deep(.el-icon) {

    font-size: 22px !important;
    transform: translateY(1px);
  }

  &:hover:not(:disabled) {
    background: #0063cc !important;
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    background: #e5e7eb !important;
    color: #9ca3af !important;
    cursor: not-allowed;
  }
}

/* 聚焦状态时的容器效果 */
.ds-input-wrapper:focus-within {
  border-color: #007AFF;
  box-shadow: 0 0 0 3px #007AFF1a;
}
</style>