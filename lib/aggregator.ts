import { ModelResponse } from '@/types/inspiration'

export function aggregateResponses(responses: ModelResponse[]): string {
  if (responses.length === 0) {
    return 'No responses to aggregate.'
  }

  if (responses.length === 1) {
    return responses[0].response
  }

  // Simple aggregation strategy: combine insights and remove duplicates
  const validResponses = responses.filter(r => r.response && r.response.trim())
  
  if (validResponses.length === 0) {
    return 'Unable to generate valid responses.'
  }

  // Extract key points from each response
  const allContent = validResponses.map(r => r.response).join('\n\n---\n\n')
  
  // For now, return a formatted combination
  // In a production environment, you might want to use another AI model to truly aggregate
  const aggregated = `# Comprehensive Exploration

Based on analysis from ${validResponses.length} AI models, here are the key insights:

${allContent}

---

*This response combines insights from multiple AI models: ${validResponses.map(r => r.modelName).join(', ')}*`

  return aggregated
}