"use client"

import { usePresetsStore } from "@/store/presetsStore"
import { useQueryStore } from "@/store/queryStore"
import { PresetItem } from "./PresetItem"

export function SavedPresets() {
  const items = usePresetsStore((state) => state.items)
  const removePreset = usePresetsStore((state) => state.removePreset)
  const setTree = useQueryStore((state) => state.setTree)
  const setSchema = useQueryStore((state) => state.setSchema)

  return (
    <section className="space-y-2">
      <h2 className="text-lg mt-4 font-semibold text-(--app-text)">Presets</h2>
      {items.length ? (
        items.map((item) => (
          <PresetItem
            key={item.id}
            item={item}
            onLoad={() => {
              setSchema(item.schemaId)
              setTree(item.tree)
            }}
            onRemove={() => removePreset(item.id)}
          />
        ))
      ) : (
        <p className="text-sm text-(--syntax-text)">No saved presets.</p>
      )}
    </section>
  )
}
