import type { QueryGroup, QueryNode, QueryRule } from "@/types/query"

function escapePromQL(value: string): string {
  return value.replaceAll('"', '\\"').replaceAll("\\", "\\\\")
}

function ruleToPromQL(rule: QueryRule): string {
  const field = rule.field
  const raw = rule.value

  if (rule.operator === "isNull") return `${field}=""`
  if (rule.operator === "isNotNull") return `${field}!=""`

  if (typeof raw === "string") {
    switch (rule.operator) {
      case "equals":
        return `${field}="${escapePromQL(raw)}"`
      case "notEquals":
        return `${field}!="${escapePromQL(raw)}"`
      case "contains":
        return `${field}=~".*${escapePromQL(raw)}.*"`
      case "startsWith":
        return `${field}=~"^${escapePromQL(raw)}.*"`
      case "regex":
        return `${field}=~"${escapePromQL(raw)}"`
      case "greaterThan":
        return `${field}>${raw}`
      case "lessThan":
        return `${field}<${raw}`
      case "before":
        return `${field}<${raw}`
      case "after":
        return `${field}>${raw}`
    }
  }

  if (typeof raw === "number") {
    switch (rule.operator) {
      case "equals":
        return `${field}="${raw}"`
      case "notEquals":
        return `${field}!="${raw}"`
      case "greaterThan":
        return `${field}>${raw}`
      case "lessThan":
        return `${field}<${raw}`
      case "between": {
        const arr = Array.isArray(rule.value) ? rule.value : []
        return `${field}>=${arr[0]},${field}<=${arr[1]}`
      }
    }
  }

  if (Array.isArray(raw)) {
    if (rule.operator === "in" || rule.operator === "inArray") {
      const pattern = raw
        .map((v) => String(v).replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")
      return `${field}=~"${pattern}"`
    }
    if (rule.operator === "notInArray") {
      return `${field}!=""`
    }
    if (rule.operator === "between") {
      const [s, e] = raw
      return `${field}>=${s},${field}<=${e}`
    }
  }

  if (typeof raw === "boolean") {
    return rule.operator === "equals"
      ? `${field}="${raw}"`
      : `${field}!="${raw}"`
  }

  return `${field}="${raw}"`
}

function nodeToPromQL(node: QueryNode): string {
  if (node.type === "rule") return ruleToPromQL(node)
  if (node.children.length === 0) return ""

  const matchers = node.children.map(nodeToPromQL).filter(Boolean)
  if (matchers.length === 0) return ""

  const comma = matchers.join(",")
  return node.logic === "AND" ? comma : `{${matchers.join(" or ")}}`
}

export function generatePromqlQuery(tree: QueryGroup) {
  const selector = nodeToPromQL(tree)
  return selector ? `{${selector}}` : "{}"
}
