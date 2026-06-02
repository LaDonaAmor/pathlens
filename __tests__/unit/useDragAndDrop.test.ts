import { describe, expect, it, vi } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useDragAndDrop } from "@/hooks/useDragAndDrop"

describe("useDragAndDrop", () => {
  it("calls onReorder when dropping on a different index", () => {
    const onReorder = vi.fn()
    const { result } = renderHook(() => useDragAndDrop(onReorder))
    const dragPropsFrom = result.current.getDragProps(0)
    const dragPropsTo = result.current.getDragProps(2)

    act(() => {
      dragPropsFrom.onDragStart({} as React.DragEvent)
    })
    act(() => {
      dragPropsTo.onDrop({
        preventDefault: vi.fn(),
      } as unknown as React.DragEvent)
    })

    expect(onReorder).toHaveBeenCalledWith(0, 2)
  })

  it("does not call onReorder when dropping on the same index", () => {
    const onReorder = vi.fn()
    const { result } = renderHook(() => useDragAndDrop(onReorder))
    const dragProps = result.current.getDragProps(1)

    act(() => {
      dragProps.onDragStart({} as React.DragEvent)
    })
    act(() => {
      dragProps.onDrop({
        preventDefault: vi.fn(),
      } as unknown as React.DragEvent)
    })

    expect(onReorder).not.toHaveBeenCalled()
  })

  it("clears dragIndex on dragEnd", () => {
    const { result } = renderHook(() => useDragAndDrop(vi.fn()))

    act(() => {
      result.current.getDragProps(0).onDragStart({} as React.DragEvent)
    })
    expect(result.current.dragIndex).toBe(0)

    act(() => {
      result.current.getDragProps(0).onDragEnd()
    })
    expect(result.current.dragIndex).toBeNull()
  })

  it("prevents default onDragOver", () => {
    const { result } = renderHook(() => useDragAndDrop(vi.fn()))
    const preventDefault = vi.fn()

    result.current.getDragProps(0).onDragOver({
      preventDefault,
    } as unknown as React.DragEvent)

    expect(preventDefault).toHaveBeenCalled()
  })
})
