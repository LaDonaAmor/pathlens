import type {
  QueryGroup,
  QueryNode,
  QueryRule,
  QueryValue,
} from "@/types/query"

function graphqlValue(value: QueryValue): string {
  if (value === null) return "null"
  if (typeof value === "number") return String(value)
  if (typeof value === "boolean") return String(value)
  if (Array.isArray(value)) {
    return `[${value.map((v) => graphqlValue(v)).join(", ")}]`
  }
  return `"${value.replaceAll('"', '\\"')}"`
}

function ruleToGraphql(rule: QueryRule): string {
  const v = graphqlValue(rule.value)
  switch (rule.operator) {
    case "equals":
      return `${rule.field}: { eq: ${v} }`
    case "notEquals":
      return `${rule.field}: { neq: ${v} }`
    case "greaterThan":
      return `${rule.field}: { gt: ${v} }`
    case "lessThan":
      return `${rule.field}: { lt: ${v} }`
    case "contains":
      return `${rule.field}: { contains: ${v} }`
    case "startsWith":
      return `${rule.field}: { startsWith: ${v} }`
    case "in":
      return `${rule.field}: { in: ${v} }`
    case "inArray":
      return `${rule.field}: { in: ${v} }`
    case "notInArray":
      return `${rule.field}: { notIn: ${v} }`
    case "between": {
      const arr = Array.isArray(rule.value) ? rule.value : []
      return `${rule.field}: { gte: ${graphqlValue(arr[0])}, lte: ${graphqlValue(arr[1])} }`
    }
    case "isNull":
      return `${rule.field}: { isNull: true }`
    case "isNotNull":
      return `${rule.field}: { isNull: false }`
    case "regex":
      return `${rule.field}: { regex: ${v} }`
    case "before":
      return `${rule.field}: { lt: ${v} }`
    case "after":
      return `${rule.field}: { gt: ${v} }`
  }
}

function nodeToGraphql(node: QueryNode, indent = 0): string {
  const pad = "  ".repeat(indent)
  if (node.type === "rule") return pad + ruleToGraphql(node)
  if (node.children.length === 0) return ""

  const children = node.children
    .map((child) => nodeToGraphql(child, indent + 1))
    .filter(Boolean)
  if (children.length === 0) return ""

  const logic = node.logic === "AND" ? "AND" : "OR"
  return `${pad}${logic}: [\n${children.join(",\n")}\n${pad}]`
}

export function generateGraphqlQuery(tree: QueryGroup, entityName: string) {
  const where = nodeToGraphql(tree, 1)
  if (!where) return `query {\n  ${entityName} {\n    id\n    name\n  }\n}`

  return `query {\n  ${entityName}(filter: {\n${where}\n  }) {\n    id\n    name\n  }\n}`
}
