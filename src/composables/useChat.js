import OpenAI from 'openai'
import { ref } from 'vue'

const api = process.env.VUE_APP_DEEPSEEK_API_KEY || ''

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: api,
  dangerouslyAllowBrowser: true,
})

export const useChat = () => {
  const userInput = ref('')
  const messages = ref([])
  const isActive = ref(false)
  const isComposing = ref(false)
  const lastKeyWasCompositionEnd = ref(false)

  const changeModel = () => {
    isActive.value = !isActive.value
  }

  const sendMessage = async () => {
    if (!userInput.value.trim) return
    messages.value.push({ role: 'user', content: userInput.value })
    userInput.value = ''

    try {
      const response = await openai.chat.completions.create({
        messages: messages.value,
        model: isActive.value ? 'deepseek-reasoner' : 'deepseek-chat',
      })
      messages.value.push({
        role: response.choices[0].message.role,
        content: response.choices[0].message.content,
      })
    } catch (err) {
      messages.value.push({ role: 'assistant', content: 'Sorry, something went wrong!' })
    }
  }

  const handleEnter = (event) => {
    const isRealEnter =
      !isComposing.value &&
      !lastKeyWasCompositionEnd.value &&
      event.keyCode === 13

    if (isRealEnter && !event.shiftKey) {
      sendMessage()
    }
    lastKeyWasCompositionEnd.value = false
  }

  return {
    userInput,
    messages,
    isActive,
    isComposing,
    lastKeyWasCompositionEnd,
    changeModel,
    handleEnter,
    sendMessage,
  }
}
