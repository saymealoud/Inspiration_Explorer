import axios from 'axios'
import * as cheerio from 'cheerio'

export interface ScrapedData {
  title?: string
  description?: string
  content?: string
  url: string
}

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  try {
    // Validate URL
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Invalid URL protocol')
    }

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    const $ = cheerio.load(response.data)

    // Extract meta information
    const title = $('title').text().trim() || 
                 $('meta[property="og:title"]').attr('content') || 
                 $('meta[name="title"]').attr('content') || 
                 'No title found'

    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       'No description found'

    // Extract main content (try different selectors)
    let content = ''
    const contentSelectors = [
      'main',
      'article',
      '.content',
      '.post-content',
      '.entry-content',
      'body'
    ]

    for (const selector of contentSelectors) {
      const element = $(selector).first()
      if (element.length > 0) {
        content = element.text().trim()
        if (content.length > 100) break
      }
    }

    // Limit content length
    if (content.length > 2000) {
      content = content.substring(0, 2000) + '...'
    }

    return {
      title: title.substring(0, 200),
      description: description.substring(0, 500),
      content: content || 'Unable to extract content',
      url
    }
  } catch (error) {
    console.error('Scraping error:', error)
    return {
      title: 'Unable to scrape',
      description: 'Failed to extract information from the provided URL',
      content: '',
      url
    }
  }
}