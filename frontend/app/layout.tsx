import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kanban Project Manager',
  description: 'A single-board kanban app with drag and drop and card management.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
