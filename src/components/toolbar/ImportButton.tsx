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
    <label className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100">
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
