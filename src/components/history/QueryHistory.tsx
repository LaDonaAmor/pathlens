"use client"

import { useHistoryStore } from "@/store/historyStore"
import { useQueryStore } from "@/store/queryStore"
import { HistoryItem } from "./HistoryItem"

export function QueryHistory() {
  const items = useHistoryStore((state) => state.items)
  const setTree = useQueryStore((state) => state.setTree)
  const setSchema = useQueryStore((state) => state.setSchema)

  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-(--app-text)">History</h2>
      {items.length ? (
        items.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            onLoad={() => {
              setSchema(item.schemaId)
              setTree(item.tree)
            }}
          />
        ))
      ) : (
        <p className="text-sm text-(--syntax-text)">No query runs yet.</p>
      )}
    </section>
  )
}
