import type { Operator } from "./operators"

export type LogicOperator = "AND" | "OR"

export type PrimitiveValue = string | number | boolean | null

export type QueryValue =
  | PrimitiveValue
  | PrimitiveValue[]
  | [PrimitiveValue, PrimitiveValue]

export type QueryRule = {
  id: string
  type: "rule"
  field: string
  operator: Operator
  value: QueryValue
}

export type OrderByClause = {
  field: string
  direction: "ASC" | "DESC"
}

export type QueryGroup = {
  id: string
  type: "group"
  logic: LogicOperator
  collapsed: boolean
  children: QueryNode[]
  columns?: string[]
  orderBy?: OrderByClause[]
}

export type QueryNode = QueryRule | QueryGroup

export type QueryTree = QueryGroup
