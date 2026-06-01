import { describe, expect, it } from "vitest"
import { exportQuery, importQuery } from "@/lib/importExport"
import { activeAdultUsersQuery } from "@/test/fixtures/queryFixtures"

describe("importExport", () => {
  it("round trips a query tree", () => {
    expect(importQuery(exportQuery(activeAdultUsersQuery))).toEqual(
      activeAdultUsersQuery
    )
  })

  it("rejects invalid query JSON", () => {
    expect(() => importQuery("{}")).toThrow("Imported query")
  })
})
