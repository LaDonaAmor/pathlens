"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "../ui/button"

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      onClick={handleCopy}
      className="rounded-md p-1.5 cursor-pointer text-(--syntax-text)/60 transition bg-(--app-accent)/10 hover:bg-(--app-accent)/10 hover:text-(--syntax-text) border-none px-6"
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </Button>
  )
}
