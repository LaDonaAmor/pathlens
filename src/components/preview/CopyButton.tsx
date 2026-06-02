"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-md p-1.5 text-(--syntax-text)/60 transition hover:bg-white/10 hover:text-(--syntax-text)"
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  )
}
