import { create } from "zustand"
import { persist } from "zustand/middleware"
import { generateId } from "@/lib/utils"
import type { QueryTree } from "@/types/query"
import { getQueryName } from "@/lib/queryName"

export type PresetItem = {
  id: string
  name: string
  schemaId: string
  tree: QueryTree
}

type PresetsState = {
  items: PresetItem[]
  savePreset: (tree: QueryTree, schemaId: string, name?: string) => void
  removePreset: (presetId: string) => void
  clearPresets: () => void
}

export const usePresetsStore = create<PresetsState>()(
  persist(
    (set) => ({
      items: [],

      savePreset: (tree, schemaId, name) =>
        set((state) => ({
          items: [
            {
              id: generateId("preset"),
              name:
                name || getQueryName(tree, `Preset ${state.items.length + 1}`),
              schemaId,
              tree,
            },
            ...state.items,
          ],
        })),

      removePreset: (presetId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== presetId),
        })),

      clearPresets: () => set({ items: [] }),
    }),
    {
      name: "pathlens-presets",
    }
  )
)
