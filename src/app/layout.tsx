import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gamers World Collective',
  description: 'Unifying the global gaming community',
  icons: {
    icon: '/gwc_icon.png',
    shortcut: '/gwc_icon.png',
    apple: '/gwc_icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <UserProvider>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        </UserProvider>
      </body>
    </html>
  )
}