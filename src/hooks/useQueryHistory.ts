"use client"

import { useHistoryStore } from "@/store/historyStore"

export function useQueryHistory() {
  return useHistoryStore()
}
