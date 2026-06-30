import type {
  QueryGroup,
  QueryNode,
  QueryRule,
  QueryValue,
} from "@/types/query"

function cypherValue(value: QueryValue): string {
  if (value === null) return "null"
  if (typeof value === "number") return String(value)
  if (typeof value === "boolean") return String(value)
  if (Array.isArray(value)) {
    return `[${value.map((v) => cypherValue(v)).join(", ")}]`
  }
  return `'${value.replaceAll("'", "\\'")}'`
}

function ruleToCypher(rule: QueryRule): string {
  const field = `n.${rule.field}`
  const v = cypherValue(rule.value)

  switch (rule.operator) {
    case "equals":
      return `${field} = ${v}`
    case "notEquals":
      return `${field} <> ${v}`
    case "greaterThan":
      return `${field} > ${v}`
    case "lessThan":
      return `${field} < ${v}`
    case "contains":
      return `${field} CONTAINS ${v}`
    case "startsWith":
      return `${field} STARTS WITH ${v}`
    case "in":
      return `${field} IN ${v}`
    case "inArray":
      return `${v} IN ${field}`
    case "notInArray":
      return `NOT ${v} IN ${field}`
    case "between": {
      const arr = Array.isArray(rule.value) ? rule.value : []
      return `${field} >= ${cypherValue(arr[0])} AND ${field} <= ${cypherValue(arr[1])}`
    }
    case "isNull":
      return `${field} IS NULL`
    case "isNotNull":
      return `${field} IS NOT NULL`
    case "regex":
      return `${field} =~ ${v}`
    case "before":
      return `${field} < ${v}`
    case "after":
      return `${field} > ${v}`
  }
}

function nodeToCypher(node: QueryNode): string {
  if (node.type === "rule") return ruleToCypher(node)
  if (node.children.length === 0) return ""

  const children = node.children.map(nodeToCypher).filter(Boolean)
  if (children.length === 0) return ""

  const joiner = node.logic === "AND" ? " AND " : " OR "
  return children.length === 1 ? children[0] : `(${children.join(joiner)})`
}

export function generateCypherQuery(tree: QueryGroup, label: string) {
  const where = nodeToCypher(tree)
  if (!where) return `MATCH (n:${label})\nRETURN n`
  return `MATCH (n:${label})\nWHERE ${where}\nRETURN n`
}
