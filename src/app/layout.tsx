import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MenuBarComponent from './components/MenuBarComponent'
import localFont from 'next/font/local'
 
// Font files can be colocated inside of `pages`
const cursiveFont = localFont({ src: './Sacramento-Regular.ttf', variable: '--font-cursive'})

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stats Now',
  description: 'Provides an instant analysis of your Spotify or YouTube Music stats, in style. The best websites in life are free!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${cursiveFont.variable} overflow-auto`}>
        <MenuBarComponent />
        {children}
      </body>
    </html>
  )
}
