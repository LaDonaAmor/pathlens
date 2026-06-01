import type {
  QueryGroup,
  QueryNode,
  QueryRule,
  QueryValue,
} from "@/types/query"

function escapeSqlString(value: string) {
  return value.replaceAll("'", "''")
}

function sqlValue(value: QueryValue): string {
  if (Array.isArray(value)) {
    return value.map((item) => sqlValue(item)).join(", ")
  }

  if (value === null) return "NULL"
  if (typeof value === "number") return String(value)
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE"

  return `'${escapeSqlString(value)}'`
}

function ruleToSql(rule: QueryRule) {
  const field = rule.field

  switch (rule.operator) {
    case "equals":
      return `${field} = ${sqlValue(rule.value)}`

    case "notEquals":
      return `${field} != ${sqlValue(rule.value)}`

    case "contains":
      return `${field} LIKE '%${escapeSqlString(String(rule.value))}%'`

    case "startsWith":
      return `${field} LIKE '${escapeSqlString(String(rule.value))}%'`

    case "greaterThan":
      return `${field} > ${sqlValue(rule.value)}`

    case "lessThan":
      return `${field} < ${sqlValue(rule.value)}`

    case "in":
      return `${field} IN (${sqlValue(rule.value)})`

    case "between": {
      const [start, end] = Array.isArray(rule.value) ? rule.value : ["", ""]
      return `${field} BETWEEN ${sqlValue(start)} AND ${sqlValue(end)}`
    }

    case "isNull":
      return `${field} IS NULL`

    case "isNotNull":
      return `${field} IS NOT NULL`

    case "regex":
      return `${field} REGEXP ${sqlValue(rule.value)}`

    case "before":
      return `${field} < ${sqlValue(rule.value)}`

    case "after":
      return `${field} > ${sqlValue(rule.value)}`

    default:
      return `${field} = ${sqlValue(rule.value)}`
  }
}

function nodeToSql(node: QueryNode): string {
  if (node.type === "rule") {
    return ruleToSql(node)
  }

  if (node.children.length === 0) {
    return ""
  }

  const children = node.children.map(nodeToSql).filter(Boolean)

  if (children.length === 0) {
    return ""
  }

  return `(${children.join(` ${node.logic} `)})`
}

export function generateSqlQuery(tree: QueryGroup, tableName: string) {
  const whereClause = nodeToSql(tree)

  if (!whereClause) {
    return `SELECT * FROM ${tableName};`
  }

  return `SELECT * FROM ${tableName}\nWHERE ${whereClause};`
}
