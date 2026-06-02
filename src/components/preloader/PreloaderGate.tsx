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
  const [phase, setPhase] = useState<"loading" | "fade-out" | "ready">(
    "loading"
  )

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fade-out"), minDuration - 300)
    const t2 = setTimeout(() => setPhase("ready"), minDuration)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [minDuration])

  if (phase === "ready") return <>{children}</>

  return (
    <div
      className={`
        transition-opacity duration-300 ease-out
        ${phase === "fade-out" ? "opacity-0" : "opacity-100"}
      `}
    >
      <PathLensPreloader />
    </div>
  )
}
