import type { QueryTree } from "@/types/query"

export function exportQuery(tree: QueryTree) {
  return JSON.stringify(tree, null, 2)
}

export function importQuery(value: string): QueryTree {
  const parsed = JSON.parse(value) as QueryTree

  if (!parsed || parsed.type !== "group" || !Array.isArray(parsed.children)) {
    throw new Error("Imported query must be a query group.")
  }

  return parsed
}
