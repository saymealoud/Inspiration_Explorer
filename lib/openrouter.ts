import { AIModel } from '@/types/inspiration'

export class OpenRouterClient {
  private apiKey: string
  private baseUrl = 'https://openrouter.ai/api/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(
    model: AIModel,
    prompt: string,
    context?: string
  ): Promise<{
    response: string
    tokens: number
    processingTime: number
  }> {
    const startTime = Date.now()

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'Inspiration Explorer',
        },
        body: JSON.stringify({
          model: model.id,
          messages: [
            {
              role: 'system',
              content: 'You are an intelligent assistant that helps explore and expand on inspirations, ideas, and concepts. Provide thoughtful, comprehensive responses that offer new perspectives and actionable insights. Format your response in markdown.'
            },
            {
              role: 'user',
              content: context ? `Context: ${context}\n\nInspiration: ${prompt}` : prompt
            }
          ],
          max_tokens: Math.min(model.maxTokens, 2000),
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`)
      }

      const data = await response.json()
      const processingTime = Date.now() - startTime

      return {
        response: data.choices[0]?.message?.content || 'No response generated',
        tokens: data.usage?.total_tokens || 0,
        processingTime
      }
    } catch (error) {
      console.error(`Error with model ${model.name}:`, error)
      throw error
    }
  }
}