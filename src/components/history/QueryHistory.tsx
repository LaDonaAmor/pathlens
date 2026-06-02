"use client"

import { useHistoryStore } from "@/store/historyStore"
import { useQueryStore } from "@/store/queryStore"
import { HistoryItem } from "./HistoryItem"
import { Button } from "../ui/button"

export function QueryHistory() {
  const items = useHistoryStore((state) => state.items)
  const setTree = useQueryStore((state) => state.setTree)
  const setSchema = useQueryStore((state) => state.setSchema)
  const clearHistory = useHistoryStore((state) => state.clearHistory)
  const removeHistory = useHistoryStore((state) => state.removeHistory)

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3 py-4">
        <h2 className="text-lg font-semibold text-(--app-text)">History</h2>

        {items.length ? (
          <Button
            onClick={clearHistory}
            className="h-8 px-2 text-xs text-(--error)"
          >
            Clear
          </Button>
        ) : null}
      </div>

      {items.length ? (
        items.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            onLoad={() => {
              setSchema(item.schemaId)
              setTree(item.tree)
            }}
            onRemove={() => removeHistory(item.id)}
          />
        ))
      ) : (
        <p className="text-sm text-(--syntax-text)">No query runs yet.</p>
      )}
    </section>
  )
}
