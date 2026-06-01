import { describe, expect, it } from "vitest"
import { generateMongoQuery } from "@/lib/queryEngine"
import { activeAdultUsersQuery } from "@/test/fixtures/queryFixtures"

describe("generateMongoQuery", () => {
  it("generates a mongo query object", () => {
    expect(generateMongoQuery(activeAdultUsersQuery)).toEqual({
      $and: [{ age: { $gt: 18 } }, { status: "active" }],
    })
  })
})
