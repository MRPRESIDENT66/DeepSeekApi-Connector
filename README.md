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

Create a `.env.local` file in the project root:

```bash
VUE_APP_DEEPSEEK_API_KEY=your_deepseek_api_key
```

The app reads this value from `process.env.VUE_APP_DEEPSEEK_API_KEY`.

## Run in Development

```bash
pnpm serve
```

## Build for Production

```bash
pnpm build
```
