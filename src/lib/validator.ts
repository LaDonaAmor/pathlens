import { getOperatorDefinition } from "@/types/operators"
import type { QueryNode } from "@/types/query"
import type { DataSchema } from "@/types/schema"

export type ValidationIssue = {
  nodeId: string
  message: string
}

function isEmptyValue(value: unknown) {
  return (
    value === "" ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0)
  )
}

function hasEmptyBetweenValue(value: unknown) {
  return (
    !Array.isArray(value) ||
    value.length < 2 ||
    isEmptyValue(value[0]) ||
    isEmptyValue(value[1])
  )
}

function isValidDate(value: unknown) {
  if (typeof value !== "string") return false
  return !Number.isNaN(new Date(value).getTime())
}

export function validateQueryTree(
  node: QueryNode,
  schema: DataSchema
): ValidationIssue[] {
  if (node.type === "group") {
    const ownIssue =
      node.children.length === 0
        ? [
            {
              nodeId: node.id,
              message: "Group must contain at least one rule or group.",
            },
          ]
        : []

    return [
      ...ownIssue,
      ...node.children.flatMap((child) => validateQueryTree(child, schema)),
    ]
  }

  const issues: ValidationIssue[] = []
  const field = schema.fields.find((item) => item.key === node.field)
  const operator = getOperatorDefinition(node.operator)

  if (!field) {
    issues.push({
      nodeId: node.id,
      message: "Choose a valid field.",
    })

    return issues
  }

  if (!operator || !operator.supportedTypes.includes(field.type)) {
    issues.push({
      nodeId: node.id,
      message: `${node.operator} cannot be used with ${field.label}.`,
    })
  }

  if (operator?.requiresValue && isEmptyValue(node.value)) {
    issues.push({
      nodeId: node.id,
      message: "Enter a value for this rule.",
    })
  }

  if (node.operator === "between" && hasEmptyBetweenValue(node.value)) {
    issues.push({
      nodeId: node.id,
      message: "Between requires a start and end value.",
    })
  }

  if (field.type === "date") {
    if (
      node.operator === "between" &&
      Array.isArray(node.value) &&
      (!isValidDate(node.value[0]) || !isValidDate(node.value[1]))
    ) {
      issues.push({
        nodeId: node.id,
        message: "Enter a valid date range.",
      })
    }

    if (
      (node.operator === "before" || node.operator === "after") &&
      !isValidDate(node.value)
    ) {
      issues.push({
        nodeId: node.id,
        message: "Enter a valid date.",
      })
    }
  }

  if (node.operator === "regex") {
    try {
      new RegExp(String(node.value))
    } catch {
      issues.push({
        nodeId: node.id,
        message: "Enter a valid regular expression.",
      })
    }
  }

  return issues
}
