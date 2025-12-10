import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Princess Todo List',
  description: 'A magical princess-themed todo list application',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="w-full h-full">
      <body className={`${inter.className} w-full min-h-screen`}>{children}</body>
    </html>
  )
}

