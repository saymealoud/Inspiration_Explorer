# Inspiration Explorer

A sophisticated web application for capturing, exploring, and expanding inspirations using AI assistance.

## Features

- **Multi-Input Support**: Text, images, and links
- **AI Model Rotation**: Uses 5 free models via OpenRouter API
- **Web Scraping**: Automatic content extraction from links
- **Markdown Export**: Professional formatting and export capabilities
- **Tag Categorization**: Organize inspirations by topic
- **History Management**: Local storage with search and favorites

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.local` and add your OpenRouter API key
   - Get a free key from [openrouter.ai](https://openrouter.ai)

3. Run the development server:
   ```bash
   npm run dev
   ```

## AI Models

The app rotates between these free models:
- Kimi K2 (4000 tokens)
- DeepSeek V3.1 (4000 tokens)
- Gemini 2.0 Flash (3500 tokens)
- GPT-OSS-120B (3000 tokens)
- Mistral Small 3.1 (3000 tokens)

## Architecture

- **Frontend**: Next.js 14 + Tailwind CSS + Framer Motion
- **AI Integration**: OpenRouter API with rotation strategy
- **Web Scraping**: Cheerio + Axios
- **Storage**: LocalStorage for MVP (easily extensible to Supabase)
- **Export**: Markdown with syntax highlighting