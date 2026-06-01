import type { QueryGroup, QueryNode, QueryRule } from "@/types/query"

export type MongoQuery = Record<string, unknown>

function ruleToMongo(rule: QueryRule): MongoQuery {
  switch (rule.operator) {
    case "equals":
      return { [rule.field]: rule.value }

    case "notEquals":
      return { [rule.field]: { $ne: rule.value } }

    case "contains":
      return {
        [rule.field]: {
          $regex: String(rule.value),
          $options: "i",
        },
      }

    case "startsWith":
      return {
        [rule.field]: {
          $regex: `^${String(rule.value)}`,
          $options: "i",
        },
      }

    case "greaterThan":
      return { [rule.field]: { $gt: rule.value } }

    case "lessThan":
      return { [rule.field]: { $lt: rule.value } }

    case "in":
      return {
        [rule.field]: {
          $in: Array.isArray(rule.value) ? rule.value : [rule.value],
        },
      }

    case "between": {
      const [start, end] = Array.isArray(rule.value) ? rule.value : [null, null]
      return {
        [rule.field]: {
          $gte: start,
          $lte: end,
        },
      }
    }

    case "isNull":
      return { [rule.field]: null }

    case "isNotNull":
      return { [rule.field]: { $ne: null } }

    case "regex":
      return { [rule.field]: { $regex: String(rule.value) } }

    case "before":
      return { [rule.field]: { $lt: rule.value } }

    case "after":
      return { [rule.field]: { $gt: rule.value } }

    default:
      return { [rule.field]: rule.value }
  }
}

function nodeToMongo(node: QueryNode): MongoQuery {
  if (node.type === "rule") {
    return ruleToMongo(node)
  }

  const children = node.children.map(nodeToMongo)

  if (children.length === 0) {
    return {}
  }

  return node.logic === "AND" ? { $and: children } : { $or: children }
}

export function generateMongoQuery(tree: QueryGroup) {
  return nodeToMongo(tree)
}
