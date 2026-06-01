import { describe, expect, it } from "vitest"
import { sanitizeQueryTree } from "@/lib/sanitizer"
import { usersSchema } from "@/test/fixtures/schemaFixtures"

describe("sanitizeQueryTree", () => {
  it("coerces number values", () => {
    const tree = sanitizeQueryTree(
      {
        id: "rule",
        type: "rule",
        field: "age",
        operator: "greaterThan",
        value: "18",
      },
      usersSchema.fields
    )

    expect(tree.type === "rule" ? tree.value : null).toBe(18)
  })

  it("splits comma-separated values for in-array rules", () => {
    const tree = sanitizeQueryTree(
      {
        id: "rule",
        type: "rule",
        field: "country",
        operator: "in",
        value: "Nigeria, Ghana",
      },
      usersSchema.fields
    )

    expect(tree.type === "rule" ? tree.value : null).toEqual([
      "Nigeria",
      "Ghana",
    ])
  })
})
