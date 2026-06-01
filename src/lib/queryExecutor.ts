import type { QueryNode, QueryRule } from "@/types/query"
import type { DataRecord, QueryResult, SortState } from "@/types/results"

function compareDate(left: unknown, right: unknown) {
  return new Date(String(left)).getTime() - new Date(String(right)).getTime()
}

function normalizeString(value: unknown) {
  return String(value ?? "").toLowerCase()
}

function toArray(value: unknown) {
  return Array.isArray(value) ? value : [value]
}

function matchesArray(actual: unknown, expected: unknown) {
  if (!Array.isArray(actual)) return false

  const actualValues = actual.map(String)
  const expectedValues = toArray(expected).map(String)

  return expectedValues.some((value) => actualValues.includes(value))
}

function matchesRule(row: DataRecord, rule: QueryRule) {
  const actual = row[rule.field]
  const expected = rule.value

  switch (rule.operator) {
    case "equals":
      return actual === expected

    case "notEquals":
      return actual !== expected

    case "contains":
      return normalizeString(actual).includes(normalizeString(expected))

    case "startsWith":
      return normalizeString(actual).startsWith(normalizeString(expected))

    case "greaterThan":
      return Number(actual) > Number(expected)

    case "lessThan":
      return Number(actual) < Number(expected)

    case "in":
      return toArray(expected).map(String).includes(String(actual))

    case "inArray":
      return matchesArray(actual, expected)

    case "notInArray":
      return !matchesArray(actual, expected)

    case "between": {
      if (!Array.isArray(expected)) return false

      const [start, end] = expected

      if (typeof actual === "string" && String(start).includes("-")) {
        return compareDate(actual, start) >= 0 && compareDate(actual, end) <= 0
      }

      return Number(actual) >= Number(start) && Number(actual) <= Number(end)
    }

    case "isNull":
      return actual === null || actual === undefined

    case "isNotNull":
      return actual !== null && actual !== undefined

    case "regex": {
      try {
        return new RegExp(String(expected), "i").test(String(actual ?? ""))
      } catch {
        return false
      }
    }

    case "before":
      return compareDate(actual, expected) < 0

    case "after":
      return compareDate(actual, expected) > 0
  }
}

export function matchesNode(row: DataRecord, node: QueryNode): boolean {
  if (node.type === "rule") return matchesRule(row, node)
  if (node.children.length === 0) return true

  return node.logic === "AND"
    ? node.children.every((child) => matchesNode(row, child))
    : node.children.some((child) => matchesNode(row, child))
}

function sortRows(rows: DataRecord[], sort?: SortState | null) {
  if (!sort?.field) return rows

  return [...rows].sort((left, right) => {
    const leftValue = left[sort.field]
    const rightValue = right[sort.field]

    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return sort.direction === "asc"
        ? leftValue - rightValue
        : rightValue - leftValue
    }

    return sort.direction === "asc"
      ? String(leftValue).localeCompare(String(rightValue))
      : String(rightValue).localeCompare(String(leftValue))
  })
}

export function executeQuery(
  data: DataRecord[],
  tree: QueryNode,
  sort?: SortState | null
): QueryResult {
  const isClient = typeof window !== "undefined"
  const start = isClient ? performance.now() : 0

  const rows = sortRows(
    data.filter((row) => matchesNode(row, tree)),
    sort
  )

  return {
    rows,
    total: rows.length,
    executionTimeMs: isClient ? performance.now() - start : 0,
  }
}
