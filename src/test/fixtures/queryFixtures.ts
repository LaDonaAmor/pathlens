import type { QueryTree } from "@/types/query"

export const activeAdultUsersQuery: QueryTree = {
  id: "group_root",
  type: "group",
  logic: "AND",
  collapsed: false,
  children: [
    {
      id: "rule_age",
      type: "rule",
      field: "age",
      operator: "greaterThan",
      value: 18,
    },
    {
      id: "rule_status",
      type: "rule",
      field: "status",
      operator: "equals",
      value: "active",
    },
  ],
}

export const nestedUsersQuery: QueryTree = {
  id: "group_root",
  type: "group",
  logic: "OR",
  collapsed: false,
  children: [
    {
      id: "group_demographic",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "rule_age",
          type: "rule",
          field: "age",
          operator: "greaterThan",
          value: 18,
        },
        {
          id: "rule_country",
          type: "rule",
          field: "country",
          operator: "equals",
          value: "Nigeria",
        },
      ],
    },
    {
      id: "group_activity",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "rule_status",
          type: "rule",
          field: "status",
          operator: "equals",
          value: "active",
        },
        {
          id: "rule_purchases",
          type: "rule",
          field: "purchases",
          operator: "greaterThan",
          value: 10,
        },
      ],
    },
  ],
}
