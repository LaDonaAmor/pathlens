import { describe, expect, it } from "vitest"
import { moveItem } from "@/lib/utils"

describe("moveItem", () => {
  it("moves an item forward in the array", () => {
    expect(moveItem(["a", "b", "c", "d"], 0, 2)).toEqual(["b", "c", "a", "d"])
  })

  it("moves an item backward in the array", () => {
    expect(moveItem(["a", "b", "c", "d"], 3, 1)).toEqual(["a", "d", "b", "c"])
  })

  it("returns the same array when from and to are equal", () => {
    expect(moveItem(["a", "b", "c"], 1, 1)).toEqual(["a", "b", "c"])
  })

  it("does not mutate the original array", () => {
    const original = ["x", "y", "z"]
    const copy = [...original]
    moveItem(original, 0, 2)
    expect(original).toEqual(copy)
  })

  it("handles a single-element array", () => {
    expect(moveItem(["only"], 0, 0)).toEqual(["only"])
  })
})
