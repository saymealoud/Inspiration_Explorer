import { NextRequest, NextResponse } from 'next/server'
import { OpenRouterClient } from '@/lib/openrouter'
import { modelManager } from '@/lib/models'
import { scrapeWebsite } from '@/lib/scraper'
import { aggregateResponses } from '@/lib/aggregator'
import { InspirationData, ModelResponse, ProcessingResult } from '@/types/inspiration'

export async function POST(request: NextRequest) {
  try {
    const data: InspirationData = await request.json()
    const startTime = Date.now()

    // Initialize OpenRouter client
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    const client = new OpenRouterClient(apiKey)
    
    // Process different input types
    let processedContent = data.content
    let extractedInfo: any = {}

    if (data.type === 'link' && data.content) {
      try {
        extractedInfo = await scrapeWebsite(data.content)
        processedContent = `${data.content}\n\nExtracted Information:\nTitle: ${extractedInfo.title}\nDescription: ${extractedInfo.description}\n\nContent Preview: ${extractedInfo.content.substring(0, 1000)}`
      } catch (error) {
        console.error('Scraping failed:', error)
        extractedInfo = { url: data.content, title: 'Scraping failed' }
      }
    }

    if (data.type === 'image' && data.image) {
      // For image processing, we'll add a note that OCR would be implemented here
      processedContent += '\n\n[Image uploaded - OCR processing would be implemented here]'
    }

    // Add tags context
    if (data.tags.length > 0) {
      processedContent += `\n\nRelevant categories: ${data.tags.join(', ')}`
    }

    // Get all models for parallel processing
    const models = modelManager.getAllModels()
    const individualResponses: ModelResponse[] = []

    // Process with multiple models in parallel
    const modelPromises = models.map(async (model) => {
      try {
        const result = await client.generateResponse(model, processedContent, extractedInfo.content)
        return {
          modelName: model.name,
          modelId: model.id,
          response: result.response,
          tokens: result.tokens,
          processingTime: result.processingTime
        }
      } catch (error) {
        console.error(`Error with model ${model.name}:`, error)
        return {
          modelName: model.name,
          modelId: model.id,
          response: `Error: Unable to process with ${model.name}`,
          tokens: 0,
          processingTime: 0
        }
      }
    })

    const responses = await Promise.allSettled(modelPromises)
    
    responses.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        individualResponses.push(result.value)
      } else {
        individualResponses.push({
          modelName: models[index].name,
          modelId: models[index].id,
          response: 'Failed to generate response',
          tokens: 0,
          processingTime: 0
        })
      }
    })

    // Aggregate responses
    const aggregatedResponse = aggregateResponses(individualResponses)

    const result: ProcessingResult = {
      originalInput: data,
      extractedInfo,
      individualResponses,
      aggregatedResponse,
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process inspiration' },
      { status: 500 }
    )
  }
}