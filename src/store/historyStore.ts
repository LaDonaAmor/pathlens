import { create } from "zustand"
import { persist } from "zustand/middleware"
import { generateId } from "@/lib/utils"
import type { QueryTree } from "@/types/query"
import { getQueryName } from "@/lib/queryName"

export type HistoryItem = {
  id: string
  name: string
  createdAt: string
  schemaId: string
  tree: QueryTree
}

type HistoryState = {
  items: HistoryItem[]
  addHistory: (tree: QueryTree, schemaId: string) => void
  removeHistory: (historyId: string) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      items: [],

      addHistory: (tree, schemaId) =>
        set((state) => ({
          items: [
            {
              id: generateId("history"),
              name: getQueryName(tree, `Run ${state.items.length + 1}`),
              createdAt: new Date().toLocaleString(),
              schemaId,
              tree,
            },
            ...state.items,
          ].slice(0, 10),
        })),

      removeHistory: (historyId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== historyId),
        })),

      clearHistory: () => set({ items: [] }),
    }),
    {
      name: "pathlens-history",
    }
  )
)
