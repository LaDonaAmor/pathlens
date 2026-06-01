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
})
