"use client"

import { useEffect } from "react"

type ShortcutHandlers = {
  onRun: () => void
  onReset: () => void
  onSave?: () => void
}

export function useKeyboardShortcuts({
  onRun,
  onReset,
  onSave,
}: ShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isModifier = event.ctrlKey || event.metaKey

      if (isModifier && event.key === "Enter") {
        event.preventDefault()
        onRun()
      }

      if (isModifier && event.key.toLowerCase() === "backspace") {
        event.preventDefault()
        onReset()
      }

      if (isModifier && event.key.toLowerCase() === "s") {
        event.preventDefault()
        onSave?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onRun, onReset, onSave])
}
