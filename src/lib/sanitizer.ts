import type { QueryGroup, QueryNode, QueryRule } from "@/types/query"
import type { SchemaField } from "@/types/schema"

function sanitizeRule(rule: QueryRule, fields: SchemaField[]): QueryRule {
  const field = fields.find((item) => item.key === rule.field)

  if (!field) return rule

  if (rule.operator === "isNull" || rule.operator === "isNotNull") {
    return { ...rule, value: null }
  }

  if (field.type === "array") {
    return {
      ...rule,
      value: Array.isArray(rule.value)
        ? rule.value.map(String).filter(Boolean)
        : String(rule.value).trim(),
    }
  }

  if (field.type === "number") {
    if (rule.operator === "between" && Array.isArray(rule.value)) {
      return {
        ...rule,
        value: [Number(rule.value[0] || 0), Number(rule.value[1] || 0)],
      }
    }

    if (rule.operator === "in") {
      const values = Array.isArray(rule.value)
        ? rule.value
        : String(rule.value).split(",")

      return {
        ...rule,
        value: values.map((item) => Number(item)).filter(Number.isFinite),
      }
    }

    return { ...rule, value: Number(rule.value || 0) }
  }

  if (field.type === "boolean") {
    return {
      ...rule,
      value: rule.value === true || rule.value === "true",
    }
  }

  if (rule.operator === "in") {
    return {
      ...rule,
      value: Array.isArray(rule.value)
        ? rule.value
        : String(rule.value)
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
    }
  }

  if (typeof rule.value === "string") {
    return { ...rule, value: rule.value.trim() }
  }

  return rule
}

export function sanitizeQueryTree(
  node: QueryNode,
  fields: SchemaField[]
): QueryNode {
  if (node.type === "rule") return sanitizeRule(node, fields)

  return {
    ...node,
    children: node.children.map((child) => sanitizeQueryTree(child, fields)),
  } satisfies QueryGroup
}
