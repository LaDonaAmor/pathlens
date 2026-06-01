import type { FieldType } from "./schema"

export type Operator =
  | "equals"
  | "notEquals"
  | "contains"
  | "startsWith"
  | "greaterThan"
  | "lessThan"
  | "in"
  | "between"
  | "isNull"
  | "isNotNull"
  | "regex"
  | "before"
  | "after"

export type OperatorDefinition = {
  id: Operator
  label: string
  supportedTypes: FieldType[]
  requiresValue: boolean
}

export const OPERATORS: OperatorDefinition[] = [
  {
    id: "equals",
    label: "Equals",
    supportedTypes: ["string", "number", "boolean", "date", "enum"],
    requiresValue: true,
  },
  {
    id: "notEquals",
    label: "Not equals",
    supportedTypes: ["string", "number", "boolean", "date", "enum"],
    requiresValue: true,
  },
  {
    id: "contains",
    label: "Contains",
    supportedTypes: ["string"],
    requiresValue: true,
  },
  {
    id: "startsWith",
    label: "Starts with",
    supportedTypes: ["string"],
    requiresValue: true,
  },
  {
    id: "greaterThan",
    label: "Greater than",
    supportedTypes: ["number"],
    requiresValue: true,
  },
  {
    id: "lessThan",
    label: "Less than",
    supportedTypes: ["number"],
    requiresValue: true,
  },
  {
    id: "in",
    label: "In array",
    supportedTypes: ["string", "number", "enum"],
    requiresValue: true,
  },
  {
    id: "between",
    label: "Between",
    supportedTypes: ["number", "date"],
    requiresValue: true,
  },
  {
    id: "isNull",
    label: "Is null",
    supportedTypes: ["string", "number", "boolean", "date", "enum"],
    requiresValue: false,
  },
  {
    id: "isNotNull",
    label: "Is not null",
    supportedTypes: ["string", "number", "boolean", "date", "enum"],
    requiresValue: false,
  },
  {
    id: "regex",
    label: "Regex",
    supportedTypes: ["string"],
    requiresValue: true,
  },
  {
    id: "before",
    label: "Before",
    supportedTypes: ["date"],
    requiresValue: true,
  },
  {
    id: "after",
    label: "After",
    supportedTypes: ["date"],
    requiresValue: true,
  },
]

export function getOperatorsForType(type: FieldType) {
  return OPERATORS.filter((operator) => operator.supportedTypes.includes(type))
}

export function getOperatorDefinition(operator: Operator) {
  return OPERATORS.find((item) => item.id === operator)
}
