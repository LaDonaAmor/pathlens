import type { Metadata } from "next"
import { ThemeProvider } from "@/providers/ThemeProvider"
import "./globals.css"

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
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
