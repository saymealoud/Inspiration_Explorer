import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Inspiration Explorer',
  description: 'Explore and expand your inspirations with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
          {children}
        </div>
      </body>
    </html>
  )
}