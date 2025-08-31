import { AIModel } from '@/types/inspiration'

export const FREE_MODELS: AIModel[] = [
  { id: 'moonshotai/kimi-k2:free', name: 'Kimi K2', maxTokens: 4000 },
  { id: 'deepseek/deepseek-chat-v3.1:free', name: 'DeepSeek V3.1', maxTokens: 4000 },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash', maxTokens: 3500 },
  { id: 'openai/gpt-oss-120b:free', name: 'GPT-OSS-120B', maxTokens: 3000 },
  { id: 'mistralai/mistral-small-3.1-24b-instruct:free', name: 'Mistral Small 3.1', maxTokens: 3000 },
]

export class ModelRotationManager {
  private currentIndex = 0

  getNextModel(): AIModel {
    const model = FREE_MODELS[this.currentIndex]
    this.currentIndex = (this.currentIndex + 1) % FREE_MODELS.length
    return model
  }

  getAllModels(): AIModel[] {
    return [...FREE_MODELS]
  }

  resetRotation(): void {
    this.currentIndex = 0
  }
}

export const modelManager = new ModelRotationManager()