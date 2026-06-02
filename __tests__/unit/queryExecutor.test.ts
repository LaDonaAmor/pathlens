import { describe, expect, it } from "vitest"
import { mockUsers } from "@/data/mockUsers"
import { executeQuery } from "@/lib/queryExecutor"
import { activeAdultUsersQuery } from "@/test/fixtures/queryFixtures"

describe("executeQuery", () => {
  it("filters matching rows", () => {
    const result = executeQuery(mockUsers, activeAdultUsersQuery)

    expect(
      result.rows.every(
        (row) => Number(row.age) > 18 && row.status === "active"
      )
    ).toBe(true)
  })

  it("supports sorting results", () => {
    const result = executeQuery(mockUsers, activeAdultUsersQuery, {
      field: "age",
      direction: "asc",
    })

    expect(Number(result.rows[0]?.age ?? 0)).toBeLessThanOrEqual(
      Number(result.rows.at(-1)?.age ?? 0)
    )
  })

  it("handles 'contains' operator", () => {
    const result = executeQuery(mockUsers, {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "r",
          type: "rule",
          field: "name",
          operator: "contains",
          value: "ada",
        },
      ],
    })
    expect(
      result.rows.every((row) => String(row.name).toLowerCase().includes("ada"))
    ).toBe(true)
  })

  it("handles 'inArray' operator", () => {
    const result = executeQuery(mockUsers, {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "r",
          type: "rule",
          field: "tags",
          operator: "inArray",
          value: "vip",
        },
      ],
    })
    expect(
      result.rows.every(
        (row) => Array.isArray(row.tags) && row.tags.includes("vip")
      )
    ).toBe(true)
  })

  it("handles 'isNull' operator", () => {
    const hasNullTags = mockUsers.some(
      (u) => u.tags === null || u.tags === undefined
    )
    if (!hasNullTags) return // skip if no null data

    const result = executeQuery(mockUsers, {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "r",
          type: "rule",
          field: "tags",
          operator: "isNull",
          value: null,
        },
      ],
    })
    expect(
      result.rows.every((row) => row.tags === null || row.tags === undefined)
    ).toBe(true)
  })

  it("handles 'regex' operator", () => {
    const result = executeQuery(mockUsers, {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "r",
          type: "rule",
          field: "email",
          operator: "regex",
          value: "^[a-z]",
        },
      ],
    })
    expect(result.rows.every((row) => /^[a-z]/i.test(String(row.email)))).toBe(
      true
    )
  })

  it("handles 'between' with date values", () => {
    const result = executeQuery(mockUsers, {
      id: "root",
      type: "group",
      logic: "AND",
      collapsed: false,
      children: [
        {
          id: "r",
          type: "rule",
          field: "createdAt",
          operator: "between",
          value: ["2023-01-01", "2023-12-31"],
        },
      ],
    })
    expect(
      result.rows.every((row) => {
        const d = new Date(String(row.createdAt)).getTime()
        return (
          d >= new Date("2023-01-01").getTime() &&
          d <= new Date("2023-12-31").getTime()
        )
      })
    ).toBe(true)
  })
})
