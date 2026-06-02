import type { QueryNode, QueryTree } from "@/types/query"

function isValidNode(node: unknown): node is QueryNode {
  if (!node || typeof node !== "object") return false
  const n = node as Record<string, unknown>
  if (typeof n.id !== "string") return false
  if (n.type === "rule") {
    return (
      typeof n.field === "string" &&
      typeof n.operator === "string" &&
      (n.value === null ||
        typeof n.value === "string" ||
        typeof n.value === "number" ||
        typeof n.value === "boolean" ||
        Array.isArray(n.value))
    )
  }
  if (n.type === "group") {
    if (n.logic !== "AND" && n.logic !== "OR") return false
    if (typeof n.collapsed !== "boolean") return false
    if (!Array.isArray(n.children)) return false
    return n.children.every((child: unknown) => isValidNode(child))
  }
  return false
}

export function exportQuery(tree: QueryTree) {
  return JSON.stringify(tree, null, 2)
}

export function importQuery(value: string): QueryTree {
  let parsed: unknown
  try {
    parsed = JSON.parse(value)
  } catch {
    throw new Error("Invalid JSON file.")
  }

  if (!isValidNode(parsed) || parsed.type !== "group") {
    throw new Error(
      "Imported query must be a valid query group with properly structured nodes."
    )
  }

  return parsed as QueryTree
}
