'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, History, Settings, Lightbulb } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Explore', icon: Lightbulb },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-morphism rounded-2xl px-6 py-3 shadow-2xl">
        <div className="flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary-600 rounded-xl -z-10"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}