"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { HistoryItem as HistoryRecord } from "@/store/historyStore"

export function HistoryItem({
  item,
  onLoad,
  onRemove,
}: {
  item: HistoryRecord
  onLoad: () => void
  onRemove: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-(--app-border) p-2">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-(--app-text)">
          {item.name}
        </p>
        <p className="text-xs text-(--app-text-muted)">
          {item.schemaId} - {item.createdAt}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button onClick={onLoad}>Load</Button>
        <Button
          onClick={onRemove}
          className="h-8 w-8 px-0 text-(--error)"
          aria-label="Remove history item"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  )
}
