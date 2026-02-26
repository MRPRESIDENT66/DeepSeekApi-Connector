# DeepSeek API Connector

A Vue 3 frontend demo for calling the DeepSeek chat API directly from the browser.

## Requirements

- Node.js 18+
- pnpm (recommended)

## Install

```bash
pnpm install
```

## Configure API Key

Edit the API key value in:

- `src/composables/useChat.js`

Find this line and replace it with your own key:

```js
let api = 'YOUR_DEEPSEEK_API_KEY'
```

## Run in Development

```bash
pnpm serve
```

## Build for Production

```bash
pnpm build
```
