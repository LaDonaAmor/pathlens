import type { Metadata } from "next"
import { EB_Garamond, JetBrains_Mono } from "next/font/google"
import { ThemeProvider } from "@/providers/ThemeProvider"
import "./globals.css"

const serif = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
})

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "PathLens - Visual Query Builder",
  description: "Build complex queries through a clearer lens.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${mono.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
