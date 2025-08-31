'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Sparkles } from 'lucide-react'
import InspirationInput from './InspirationInput'
import ResponseDisplay from './ResponseDisplay'
import { InspirationData, ProcessingResult } from '@/types/inspiration'

export default function InspirationExplorer() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<ProcessingResult | null>(null)

  const handleInspirationSubmit = async (data: InspirationData) => {
    setIsProcessing(true)
    setResults(null)

    try {
      const response = await fetch('/api/process-inspiration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to process inspiration')
      }

      const result = await response.json()
      setResults(result)
    } catch (error) {
      console.error('Error processing inspiration:', error)
      // Handle error state
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Lightbulb className="w-12 h-12 text-primary-600" />
            <Sparkles className="w-6 h-6 text-accent-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold gradient-text">
            Inspiration Explorer
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your ideas into comprehensive insights with AI-powered exploration
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <InspirationInput 
            onSubmit={handleInspirationSubmit}
            isProcessing={isProcessing}
          />
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <ResponseDisplay 
            results={results}
            isProcessing={isProcessing}
          />
        </motion.div>
      </div>
    </div>
  )
}