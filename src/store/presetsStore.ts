import { create } from "zustand"
import { persist } from "zustand/middleware"
import { generateId } from "@/lib/utils"
import type { QueryTree } from "@/types/query"

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

function getQueryName(tree: QueryTree, fallback: string) {
  const firstRule = tree.children.find((child) => child.type === "rule")

  if (firstRule?.type === "rule") {
    return `${firstRule.field} ${firstRule.operator} ${String(firstRule.value || "value")}`
  }

  const groupCount = tree.children.filter(
    (child) => child.type === "group"
  ).length
  const ruleCount = tree.children.filter(
    (child) => child.type === "rule"
  ).length

  if (ruleCount || groupCount) {
    return `${tree.logic} query: ${ruleCount} rule${ruleCount === 1 ? "" : "s"}, ${groupCount} group${groupCount === 1 ? "" : "s"}`
  }

  return fallback
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
