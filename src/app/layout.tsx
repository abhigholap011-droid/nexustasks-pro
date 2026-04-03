import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nexus AI - Next Generation Intelligence',
  description: 'Experience the future of artificial intelligence with our cutting-edge platform built with advanced design principles.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        {children}
      </body>
    </html>
  )
}
