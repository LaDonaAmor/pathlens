import { describe, expect, it } from "vitest"
import { useQueryStore } from "@/store/queryStore"

describe("queryStore", () => {
  it("adds a rule to the root group", () => {
    useQueryStore.getState().reset()

    const rootId = useQueryStore.getState().tree.id
    const before = useQueryStore.getState().tree.children.length

    useQueryStore.getState().addRule(rootId)

    expect(useQueryStore.getState().tree.children.length).toBe(before + 1)
  })

  it("updates group logic", () => {
    useQueryStore.getState().reset()

    const rootId = useQueryStore.getState().tree.id
    useQueryStore.getState().setGroupLogic(rootId, "OR")

    expect(useQueryStore.getState().tree.logic).toBe("OR")
  })

  it("switches schema without crashing", () => {
    useQueryStore.getState().setSchema("orders")

    expect(useQueryStore.getState().schemaId).toBe("orders")
  })
})
