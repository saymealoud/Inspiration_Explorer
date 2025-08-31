'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings as SettingsIcon, Key, Zap, Globe } from 'lucide-react'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [maxTokens, setMaxTokens] = useState(2000)
  const [autoSave, setAutoSave] = useState(true)

  useEffect(() => {
    // Load settings from localStorage
    const savedApiKey = localStorage.getItem('openrouter-api-key')
    const savedMaxTokens = localStorage.getItem('max-tokens')
    const savedAutoSave = localStorage.getItem('auto-save')

    if (savedApiKey) setApiKey(savedApiKey)
    if (savedMaxTokens) setMaxTokens(parseInt(savedMaxTokens))
    if (savedAutoSave) setAutoSave(savedAutoSave === 'true')
  }, [])

  const saveSettings = () => {
    localStorage.setItem('openrouter-api-key', apiKey)
    localStorage.setItem('max-tokens', maxTokens.toString())
    localStorage.setItem('auto-save', autoSave.toString())
    alert('Settings saved successfully!')
  }

  return (
    <main className="container mx-auto px-4 py-8 pb-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-8 shadow-xl"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary-600" />
            Settings
          </h1>

          <div className="space-y-8">
            {/* API Configuration */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Key className="w-5 h-5 text-primary-600" />
                API Configuration
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-..."
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your free API key from{' '}
                  <a
                    href="https://openrouter.ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    openrouter.ai
                  </a>
                </p>
              </div>
            </div>

            {/* Generation Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary-600" />
                Generation Settings
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens per Model
                </label>
                <input
                  type="range"
                  min="500"
                  max="4000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>500</span>
                  <span className="font-medium">{maxTokens} tokens</span>
                  <span>4000</span>
                </div>
              </div>
            </div>

            {/* App Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent-600" />
                App Settings
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Auto-save Explorations
                  </label>
                  <p className="text-xs text-gray-500">
                    Automatically save your explorations to history
                  </p>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    autoSave ? 'bg-primary-600' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                      autoSave ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              onClick={saveSettings}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Save Settings
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}