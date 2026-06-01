import { describe, expect, it } from "vitest"
import { generateSqlQuery } from "@/lib/queryEngine"
import {
  activeAdultUsersQuery,
  nestedUsersQuery,
} from "@/test/fixtures/queryFixtures"

describe("generateSqlQuery", () => {
  it("generates SQL for a basic AND group", () => {
    expect(generateSqlQuery(activeAdultUsersQuery, "users")).toContain(
      "age > 18 AND status = 'active'"
    )
  })

  it("preserves nested OR group structure", () => {
    const sql = generateSqlQuery(nestedUsersQuery, "users")

    expect(sql).toContain(" OR ")
    expect(sql).toContain("country = 'Nigeria'")
    expect(sql).toContain("purchases > 10")
  })

  it("generates a select-all query for an empty group", () => {
    expect(
      generateSqlQuery(
        {
          id: "root",
          type: "group",
          logic: "AND",
          collapsed: false,
          children: [],
        },
        "users"
      )
    ).toBe("SELECT * FROM users;")
  })
})
