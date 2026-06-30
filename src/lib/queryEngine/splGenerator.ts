import type {
  QueryGroup,
  QueryNode,
  QueryRule,
  QueryValue,
} from "@/types/query"

function splValue(value: QueryValue): string {
  if (value === null) return "NULL"
  if (typeof value === "number") return String(value)
  if (typeof value === "boolean") return String(value)
  if (Array.isArray(value)) return `(${value.map((v) => String(v)).join(", ")})`
  if (/[:\s"()]/.test(value)) return `"${value.replaceAll('"', '\\"')}"`
  return value
}

function ruleToSpl(rule: QueryRule): string {
  const field = rule.field
  const raw = rule.value

  switch (rule.operator) {
    case "equals":
      return `${field}=${splValue(raw)}`
    case "notEquals":
      return `${field}!=${splValue(raw)}`
    case "greaterThan":
      return `${field}>${splValue(raw)}`
    case "lessThan":
      return `${field}<${splValue(raw)}`
    case "contains":
      return `${field}="*${String(raw)}*"`
    case "startsWith":
      return `${field}=${String(raw)}*`
    case "in":
    case "inArray":
      return `${field} IN ${splValue(raw)}`
    case "notInArray":
      return `NOT ${field} IN ${splValue(raw)}`
    case "between": {
      const arr = Array.isArray(raw) ? raw : []
      return `${field}>=${splValue(arr[0])} ${field}<=${splValue(arr[1])}`
    }
    case "isNull":
      return `isnull(${field})`
    case "isNotNull":
      return `isnotnull(${field})`
    case "regex":
      return `${field}=${splValue(raw)}`
    case "before":
      return `${field}<${splValue(raw)}`
    case "after":
      return `${field}>${splValue(raw)}`
  }
}

function nodeToSpl(node: QueryNode): string {
  if (node.type === "rule") return ruleToSpl(node)
  if (node.children.length === 0) return ""

  const children = node.children.map(nodeToSpl).filter(Boolean)
  if (children.length === 0) return ""

  const joiner = node.logic === "AND" ? " " : " OR "
  return children.length === 1 ? children[0] : `(${children.join(joiner)})`
}

export function generateSplQuery(tree: QueryGroup) {
  const where = nodeToSpl(tree)
  return where ? `search ${where}` : "search *"
}
