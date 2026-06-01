"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PresetItem as PresetRecord } from "@/store/presetsStore"

export function PresetItem({
  item,
  onLoad,
  onRemove,
}: {
  item: PresetRecord
  onLoad: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-slate-200 p-2">
      <p className="text-sm font-medium text-slate-900">{item.name}</p>

      <div className="flex gap-2">
        <Button onClick={onLoad}>Load</Button>

        <Button
          onClick={onRemove}
          className="h-9 w-9 px-0 text-red-600"
          aria-label="Remove preset"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  )
}
