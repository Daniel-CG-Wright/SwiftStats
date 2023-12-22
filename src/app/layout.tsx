import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MenuBarComponent from './components/MenuBarComponent'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Stats',
  description: 'Shows your Spotify stats in style. The best sites in life are free!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-auto`}>
        <MenuBarComponent />
        {children}
      </body>
    </html>
  )
}
