"use client"

import { Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CopyButton({ value }: { value: string }) {
  async function handleCopy() {
    await navigator.clipboard.writeText(value)
  }

  return (
    <Button onClick={handleCopy}>
      <Copy size={16} />
      Copy
    </Button>
  )
}
