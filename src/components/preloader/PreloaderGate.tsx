"use client"

import { useEffect, useState } from "react"
import { PathLensPreloader } from "./PathLensPreloader"

export function PreloaderGate({
  children,
  minDuration = 2000,
}: {
  children: React.ReactNode
  minDuration?: number
}) {
  const [showPreloader, setShowPreloader] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowPreloader(false)
    }, minDuration)

    return () => window.clearTimeout(timer)
  }, [minDuration])

  if (showPreloader) {
    return <PathLensPreloader />
  }

  return <>{children}</>
}
