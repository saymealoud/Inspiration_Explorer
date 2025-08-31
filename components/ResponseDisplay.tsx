'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Download, 
  Copy, 
  Star, 
  ChevronDown,
  Eye,
  EyeOff,
  FileText
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { ProcessingResult } from '@/types/inspiration'

interface ResponseDisplayProps {
  results: ProcessingResult | null
  isProcessing: boolean
}

export default function ResponseDisplay({ results, isProcessing }: ResponseDisplayProps) {
  const [viewMode, setViewMode] = useState<'aggregated' | 'individual'>('aggregated')
  const [expandedModel, setExpandedModel] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const handleExportMarkdown = () => {
    if (!results) return

    const content = viewMode === 'aggregated' 
      ? results.aggregatedResponse 
      : results.individualResponses.map(r => `## ${r.modelName}\n\n${r.response}`).join('\n\n---\n\n')

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inspiration-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = async () => {
    if (!results) return

    const content = viewMode === 'aggregated' 
      ? results.aggregatedResponse 
      : results.individualResponses.map(r => `## ${r.modelName}\n\n${r.response}`).join('\n\n---\n\n')

    await navigator.clipboard.writeText(content)
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  if (isProcessing) {
    return (
      <div className="glass-morphism rounded-2xl p-8 shadow-xl">
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto"
          >
            <Brain className="w-full h-full text-primary-600" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">Processing Your Inspiration</h3>
            <p className="text-gray-600">AI models are analyzing and exploring your input...</p>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {['Extracting information...', 'Consulting AI models...', 'Aggregating insights...'].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.5, duration: 0.5 }}
                className="text-sm text-gray-500"
              >
                {step}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="glass-morphism rounded-2xl p-8 shadow-xl">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
            <Brain className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Ready to Explore</h3>
            <p className="text-gray-600">Enter your inspiration to see AI-generated insights</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-morphism rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary-600" />
          AI Insights
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'aggregated' ? 'individual' : 'aggregated')}
            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/60 hover:bg-white/80 transition-all text-sm"
          >
            {viewMode === 'aggregated' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {viewMode === 'aggregated' ? 'Show Individual' : 'Show Aggregated'}
          </button>
          <button
            onClick={handleCopyToClipboard}
            className="p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-all"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={handleExportMarkdown}
            className="p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-all"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'aggregated' ? (
          <motion.div
            key="aggregated"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="prose prose-sm max-w-none"
          >
            <div className="bg-white/60 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-800">Aggregated Response</h4>
                <button
                  onClick={() => toggleFavorite('aggregated')}
                  className={`p-1 rounded ${
                    favorites.has('aggregated') ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                  } transition-colors`}
                >
                  <Star className="w-5 h-5" fill={favorites.has('aggregated') ? 'currentColor' : 'none'} />
                </button>
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                className="prose prose-purple max-w-none"
              >
                {results.aggregatedResponse}
              </ReactMarkdown>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="individual"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {results.individualResponses.map((response, index) => (
              <div key={response.modelName} className="bg-white/60 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedModel(
                    expandedModel === response.modelName ? null : response.modelName
                  )}
                  className="w-full p-4 flex items-center justify-between hover:bg-white/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    <span className="font-semibold">{response.modelName}</span>
                    <span className="text-xs text-gray-500">
                      {response.tokens} tokens
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(response.modelName)
                      }}
                      className={`p-1 rounded ${
                        favorites.has(response.modelName) 
                          ? 'text-yellow-500' 
                          : 'text-gray-400 hover:text-yellow-500'
                      } transition-colors`}
                    >
                      <Star 
                        className="w-4 h-4" 
                        fill={favorites.has(response.modelName) ? 'currentColor' : 'none'} 
                      />
                    </button>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform ${
                        expandedModel === response.modelName ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </button>
                
                <AnimatePresence>
                  {expandedModel === response.modelName && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          className="prose prose-sm max-w-none"
                        >
                          {response.response}
                        </ReactMarkdown>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Options */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleExportMarkdown}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Export Markdown
        </button>
        <button
          onClick={handleCopyToClipboard}
          className="flex items-center gap-2 px-4 py-2 bg-white/60 text-gray-700 rounded-lg hover:bg-white/80 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy to Clipboard
        </button>
      </div>
    </div>
  )
}