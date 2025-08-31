'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Link, 
  Type, 
  Tag, 
  Send,
  Image as ImageIcon,
  X,
  Sparkles
} from 'lucide-react'
import { InspirationData } from '@/types/inspiration'

interface InspirationInputProps {
  onSubmit: (data: InspirationData) => void
  isProcessing: boolean
}

const PREDEFINED_TAGS = [
  'AI & Machine Learning',
  'Programming',
  'Design',
  'Philosophy',
  'Science',
  'Business',
  'Art & Creativity',
  'Technology'
]

export default function InspirationInput({ onSubmit, isProcessing }: InspirationInputProps) {
  const [inputType, setInputType] = useState<'text' | 'image' | 'link'>('text')
  const [textInput, setTextInput] = useState('')
  const [linkInput, setLinkInput] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)

  const handleSubmit = () => {
    if (!textInput.trim() && !linkInput.trim() && !uploadedImage) return

    const data: InspirationData = {
      type: inputType,
      content: textInput || linkInput,
      tags: selectedTags,
      image: uploadedImage,
      timestamp: new Date().toISOString(),
    }

    onSubmit(data)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setUploadedImage(file)
    }
  }

  return (
    <div className="glass-morphism rounded-2xl p-6 shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary-600" />
        Capture Your Inspiration
      </h2>

      {/* Input Type Selector */}
      <div className="flex gap-2 mb-6">
        {[
          { type: 'text' as const, icon: Type, label: 'Text' },
          { type: 'image' as const, icon: ImageIcon, label: 'Image' },
          { type: 'link' as const, icon: Link, label: 'Link' },
        ].map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => setInputType(type)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              inputType === type
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white/50 text-gray-700 hover:bg-white/70'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Input Content */}
      <div className="space-y-4 mb-6">
        {inputType === 'text' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter your inspiration, question, or idea..."
              className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-none transition-all"
            />
          </motion.div>
        )}

        {inputType === 'image' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Click to upload an image (JPG/PNG)</p>
              </label>
            </div>
            
            {uploadedImage && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <ImageIcon className="w-5 h-5 text-green-600" />
                <span className="text-green-800 flex-1">{uploadedImage.name}</span>
                <button
                  onClick={() => setUploadedImage(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Add context or questions about your image..."
              className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-none transition-all"
            />
          </motion.div>
        )}

        {inputType === 'link' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
            />
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="What would you like to explore about this link?"
              className="w-full h-24 p-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-none transition-all"
            />
          </motion.div>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white/60 text-gray-700 hover:bg-white/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={isProcessing || (!textInput.trim() && !linkInput.trim() && !uploadedImage)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Explore Inspiration
          </>
        )}
      </motion.button>
    </div>
  )
}