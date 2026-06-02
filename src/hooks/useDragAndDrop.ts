"use client"

import { useState } from "react"

export function useDragAndDrop(
  onReorder: (fromIndex: number, toIndex: number) => void
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  function getDragProps(index: number) {
    return {
      draggable: true,
      onDragStart: () => setDragIndex(index),
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        if (dragIndex !== null && dragIndex !== index) {
          onReorder(dragIndex, index)
        }
        setDragIndex(null)
      },
      onDragEnd: () => setDragIndex(null),
    }
  }

  return {
    dragIndex,
    getDragProps,
  }
}
