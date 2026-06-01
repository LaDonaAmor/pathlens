import type { QueryTree } from "@/types/query"

export function generateJsonQuery(tree: QueryTree) {
  return JSON.stringify(tree, null, 2)
}
