export interface InspirationData {
  type: 'text' | 'image' | 'link'
  content: string
  tags: string[]
  image?: File | null
  timestamp: string
}

export interface ModelResponse {
  modelName: string
  modelId: string
  response: string
  tokens: number
  processingTime: number
}

export interface ProcessingResult {
  originalInput: InspirationData
  extractedInfo?: {
    title?: string
    description?: string
    url?: string
  }
  individualResponses: ModelResponse[]
  aggregatedResponse: string
  processingTime: number
  timestamp: string
}

export interface AIModel {
  id: string
  name: string
  maxTokens: number
}