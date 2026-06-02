import { describe, expect, it, vi } from "vitest"
import { renderHook } from "@testing-library/react"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"

function dispatchKey(key: string, ctrl = true) {
  window.dispatchEvent(
    new KeyboardEvent("keydown", { key, ctrlKey: ctrl, bubbles: true })
  )
}

describe("useKeyboardShortcuts", () => {
  it("calls onRun when Ctrl+Enter is pressed", () => {
    const onRun = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onRun, onReset: vi.fn() }))
    dispatchKey("Enter")
    expect(onRun).toHaveBeenCalledTimes(1)
  })

  it("calls onReset when Ctrl+Backspace is pressed", () => {
    const onReset = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onRun: vi.fn(), onReset }))
    dispatchKey("Backspace")
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it("calls onSave when Ctrl+K is pressed", () => {
    const onSave = vi.fn()
    renderHook(() =>
      useKeyboardShortcuts({ onRun: vi.fn(), onReset: vi.fn(), onSave })
    )
    dispatchKey("k")
    expect(onSave).toHaveBeenCalledTimes(1)
  })

  it("does not call handlers for unrelated keys", () => {
    const onRun = vi.fn()
    const onReset = vi.fn()
    renderHook(() => useKeyboardShortcuts({ onRun, onReset }))
    dispatchKey("a")
    expect(onRun).not.toHaveBeenCalled()
    expect(onReset).not.toHaveBeenCalled()
  })
})
