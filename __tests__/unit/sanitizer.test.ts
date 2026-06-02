import { describe, expect, it } from "vitest"
import { sanitizeQueryTree } from "@/lib/sanitizer"
import type { QueryRule } from "@/types/query"
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

  it("sets value to null for isNull operator", () => {
    const tree = sanitizeQueryTree(
      {
        id: "r",
        type: "rule",
        field: "name",
        operator: "isNull",
        value: "anything",
      },
      usersSchema.fields
    )
    expect((tree as QueryRule).value).toBeNull()
  })

  it("sets value to null for isNotNull operator", () => {
    const tree = sanitizeQueryTree(
      {
        id: "r",
        type: "rule",
        field: "name",
        operator: "isNotNull",
        value: "anything",
      },
      usersSchema.fields
    )
    expect((tree as QueryRule).value).toBeNull()
  })

  it("coerces boolean string to true", () => {
    const tree = sanitizeQueryTree(
      {
        id: "r",
        type: "rule",
        field: "isVerified",
        operator: "equals",
        value: "true",
      },
      usersSchema.fields
    )
    expect((tree as QueryRule).value).toBe(true)
  })

  it("coerces boolean string false to false", () => {
    const tree = sanitizeQueryTree(
      {
        id: "r",
        type: "rule",
        field: "isPremium",
        operator: "equals",
        value: "false",
      },
      usersSchema.fields
    )
    expect((tree as QueryRule).value).toBe(false)
  })

  it("converts array values to string arrays", () => {
    const tree = sanitizeQueryTree(
      {
        id: "r",
        type: "rule",
        field: "tags",
        operator: "inArray",
        value: "vip",
      },
      usersSchema.fields
    )
    expect((tree as QueryRule).value).toBe("vip")
  })

  it("converts number values for 'in' operator", () => {
    const tree = sanitizeQueryTree(
      { id: "r", type: "rule", field: "age", operator: "in", value: "1, 2, 3" },
      usersSchema.fields
    )
    expect((tree as QueryRule).value).toEqual([1, 2, 3])
  })

  it("sanitizes between values to numbers for number field", () => {
    const tree = sanitizeQueryTree(
      {
        id: "r",
        type: "rule",
        field: "age",
        operator: "between",
        value: ["10", "20"],
      },
      usersSchema.fields
    )
    expect((tree as QueryRule).value).toEqual([10, 20])
  })
})
