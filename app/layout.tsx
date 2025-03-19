import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Thoughtful Gifts | Find the Perfect Gift",
  description:
    "Discover thoughtful, personalized gift ideas for any occasion based on your recipient's preferences and interests.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <nav className="border-b py-3 px-4 bg-white">
            <div className="container mx-auto flex justify-between items-center">
              <a href="/" className="font-bold text-xl">
                Thoughtfully Gift
              </a>
              <div></div>
            </div>
          </nav>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

