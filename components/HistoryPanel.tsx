'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { History, Trash2, Star, Search } from 'lucide-react'
import { ProcessingResult } from '@/types/inspiration'

export default function HistoryPanel() {
  const [history, setHistory] = useState<ProcessingResult[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('inspiration-history')
    if (saved) {
      setHistory(JSON.parse(saved))
    }

    const savedFavorites = localStorage.getItem('inspiration-favorites')
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('inspiration-history')
  }

  const toggleFavorite = (timestamp: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(timestamp)) {
      newFavorites.delete(timestamp)
    } else {
      newFavorites.add(timestamp)
    }
    setFavorites(newFavorites)
    localStorage.setItem('inspiration-favorites', JSON.stringify([...newFavorites]))
  }

  const filteredHistory = history.filter(item =>
    item.originalInput.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.originalInput.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="glass-morphism rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <History className="w-6 h-6 text-primary-600" />
          Exploration History
        </h3>
        <button
          onClick={clearHistory}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search history..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
        />
      </div>

      {/* History Items */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No explorations yet</p>
        ) : (
          filteredHistory.map((item) => (
            <motion.div
              key={item.timestamp}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 rounded-lg p-4 hover:bg-white/80 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 line-clamp-2">
                    {item.originalInput.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    {item.originalInput.tags.length > 0 && (
                      <div className="flex gap-1">
                        {item.originalInput.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(item.timestamp)
                  }}
                  className={`p-1 rounded ${
                    favorites.has(item.timestamp)
                      ? 'text-yellow-500'
                      : 'text-gray-400 hover:text-yellow-500'
                  } transition-colors`}
                >
                  <Star
                    className="w-4 h-4"
                    fill={favorites.has(item.timestamp) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}