"use client"

import { Button } from "@/components/ui/button"
import type { HistoryItem as HistoryRecord } from "@/store/historyStore"

export function HistoryItem({
  item,
  onLoad,
}: {
  item: HistoryRecord
  onLoad: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-(--app-border) p-2">
      <div>
        <p className="text-sm font-medium text-(--app-text)">{item.name}</p>
        <p className="text-xs text-(--app-text-muted)">
          {item.schemaId} - {item.createdAt}
        </p>
      </div>
      <Button onClick={onLoad}>Load</Button>
    </div>
  )
}
