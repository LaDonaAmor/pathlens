"use client"

import { Upload } from "lucide-react"
import { importQuery } from "@/lib/importExport"
import type { QueryTree } from "@/types/query"

export function ImportButton({
  onImport,
}: {
  onImport: (tree: QueryTree) => void
}) {
  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    onImport(importQuery(text))
    event.target.value = ""
  }

  return (
    <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 border-2 border-(--app-border) bg-(--app-surface) px-4 font-(--font-mono) text-xs uppercase tracking-widest text-(--app-text) transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-(--app-accent) hover:text-(--app-on-accent) active:translate-x-0 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50">
      <Upload size={16} />
      Import
      <input
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleChange}
      />
    </label>
  )
}
