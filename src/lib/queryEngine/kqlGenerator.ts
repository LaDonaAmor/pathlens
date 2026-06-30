import type {
  QueryGroup,
  QueryNode,
  QueryRule,
  QueryValue,
} from "@/types/query"

function kqlValue(value: QueryValue): string {
  if (value === null) return "null"
  if (typeof value === "number") return String(value)
  if (typeof value === "boolean") return String(value)
  if (Array.isArray(value))
    return `(${value.map((v) => String(v)).join(" OR ")})`
  if (/[:\s"(){}[\]<>]/.test(value)) return `"${value.replaceAll('"', '\\"')}"`
  return value
}

function ruleToKql(rule: QueryRule): string {
  const field = rule.field
  const v = kqlValue(rule.value)

  switch (rule.operator) {
    case "equals":
      return `${field}: ${v}`
    case "notEquals":
      return `NOT ${field}: ${v}`
    case "greaterThan":
      return `${field}: >${v}`
    case "lessThan":
      return `${field}: <${v}`
    case "contains":
      return `${field}: *${String(rule.value)}*`
    case "startsWith":
      return `${field}: ${String(rule.value)}*`
    case "in":
      return `${field}: ${v}`
    case "inArray":
      return `${field}: ${v}`
    case "notInArray":
      return `NOT ${field}: ${v}`
    case "between": {
      const arr = Array.isArray(rule.value) ? rule.value : []
      return `${field}: [${String(arr[0])} TO ${String(arr[1])}]`
    }
    case "isNull":
      return `NOT _exists_:${field}`
    case "isNotNull":
      return `_exists_:${field}`
    case "regex":
      return `${field}: /${String(rule.value).replaceAll("/", "\\/")}/`
    case "before":
      return `${field}: <${v}`
    case "after":
      return `${field}: >${v}`
  }
}

function nodeToKql(node: QueryNode): string {
  if (node.type === "rule") return ruleToKql(node)
  if (node.children.length === 0) return ""

  const children = node.children.map(nodeToKql).filter(Boolean)
  if (children.length === 0) return ""

  const joiner = node.logic === "AND" ? " AND " : " OR "
  return children.length === 1 ? children[0] : `(${children.join(joiner)})`
}

export function generateKqlQuery(tree: QueryGroup) {
  return nodeToKql(tree)
}
