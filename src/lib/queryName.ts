import type { QueryTree } from "@/types/query"

export function getQueryName(tree: QueryTree, fallback = "Untitled query") {
  const firstRule = tree.children.find((child) => child.type === "rule")

  if (firstRule?.type === "rule") {
    return `${firstRule.field} ${firstRule.operator} ${String(firstRule.value || "value")}`
  }

  const groupCount = tree.children.filter((child) => child.type === "group").length
  const ruleCount = tree.children.filter((child) => child.type === "rule").length

  if (ruleCount || groupCount) {
    return `${tree.logic} query: ${ruleCount} rule${ruleCount === 1 ? "" : "s"}, ${groupCount} group${groupCount === 1 ? "" : "s"}`
  }

  return fallback
}