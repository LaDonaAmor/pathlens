import { describe, expect, it } from "vitest"
import { validateQueryTree } from "@/lib/validator"
import { usersSchema } from "@/test/fixtures/schemaFixtures"
import type { QueryTree } from "@/types/query"

describe("validateQueryTree", () => {
  it("rejects empty groups", () => {
    const tree: QueryTree = {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [],
    }

    expect(validateQueryTree(tree, usersSchema)[0].message).toContain("Group")
  })

  it("rejects incompatible operators", () => {
    const tree: QueryTree = {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "rule",
          type: "rule",
          field: "age",
          operator: "contains",
          value: "2",
        },
      ],
    }

    expect(validateQueryTree(tree, usersSchema)).toHaveLength(1)
  })

  it("rejects invalid regex values", () => {
    const tree: QueryTree = {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "rule",
          type: "rule",
          field: "name",
          operator: "regex",
          value: "[",
        },
      ],
    }

    expect(validateQueryTree(tree, usersSchema)[0].message).toContain(
      "regular expression"
    )
  })
})
