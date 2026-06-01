"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CollapseToggle({
  collapsed,
  onClick,
}: {
  collapsed: boolean
  onClick: () => void
}) {
  const Icon = collapsed ? ChevronRight : ChevronDown

  return (
    <Button
      onClick={onClick}
      className="h-8 w-8 px-0"
      aria-label={collapsed ? "Expand group" : "Collapse group"}
    >
      <Icon size={16} />
    </Button>
  )
}
