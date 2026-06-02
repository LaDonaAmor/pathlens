"use client"

import { useEffect, useRef, useState } from "react"

export function useDragAndDrop(
  onReorder: (fromIndex: number, toIndex: number) => void
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const dragIndexRef = useRef<number | null>(null)

  useEffect(() => {
    dragIndexRef.current = dragIndex
  }, [dragIndex])

  function getDragProps(index: number) {
    return {
      draggable: true,
      onDragStart: () => setDragIndex(index),
      onDragOver: (e: React.DragEvent) => e.preventDefault(),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()

        const from = dragIndexRef.current

        if (from !== null && from !== index) {
          onReorder(from, index)
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
