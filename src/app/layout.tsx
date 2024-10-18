import { ThemeProvider } from '@/components/providers/theme-provider'
import TranslationsProvider from '@/components/providers/translations-provider'
import { translate } from '@/queries/utils-queries'
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
  manifest: '/manifest.json'
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

const i18nNamespaces = ['global', 'actions', 'editor', 'room']

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { locale, resources } = await translate(i18nNamespaces)

  return (
    <html lang="en" suppressHydrationWarning={true} className={inter.className}>
      <body className="overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>

          <TranslationsProvider
            namespaces={i18nNamespaces}
            locale={locale}
            resources={resources}>
            {children}
          </TranslationsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
