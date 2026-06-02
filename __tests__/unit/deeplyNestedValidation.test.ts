import { describe, expect, it } from "vitest"
import { validateQueryTree } from "@/lib/validator"
import { usersSchema } from "@/test/fixtures/schemaFixtures"
import type { QueryTree } from "@/types/query"

function buildDeepTree(depth: number): QueryTree {
  if (depth <= 0) {
    return {
      id: "leaf",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "rule",
          type: "rule",
          field: "age",
          operator: "greaterThan",
          value: 18,
        },
      ],
    }
  }
  return {
    id: `group_${depth}`,
    type: "group",
    logic: "AND",
    collapsed: false,
    children: [buildDeepTree(depth - 1)],
  }
}

describe("deeply nested query validation", () => {
  it("validates a tree nested 10 levels deep without error", () => {
    const tree = buildDeepTree(10)
    const issues = validateQueryTree(tree, usersSchema)
    expect(issues).toHaveLength(0)
  })

  it("validates a tree nested 10 levels deep where innermost group is empty", () => {
    const tree: QueryTree = {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "g1",
          type: "group",
          logic: "AND",
          collapsed: false,
          children: [
            {
              id: "empty",
              type: "group",
              logic: "OR",
              collapsed: false,
              children: [],
            },
          ],
        },
      ],
    }
    const issues = validateQueryTree(tree, usersSchema)
    expect(issues.length).toBeGreaterThanOrEqual(1)
    expect(issues.some((i) => i.message.includes("must contain"))).toBe(true)
  })
})
