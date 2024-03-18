import { ThemeProvider } from '@/components/providers/theme-provider'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Questions Editor',
  description: 'A personal questionnaire application',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning={true} className={inter.className}>
      <body className="overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
