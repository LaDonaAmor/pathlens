"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { generateId } from "@/lib/utils"
import type { QueryTree } from "@/types/query"

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
  clearHistory: () => void
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

      clearHistory: () => set({ items: [] }),
    }),
    {
      name: "pathlens-history",
    }
  )
)
