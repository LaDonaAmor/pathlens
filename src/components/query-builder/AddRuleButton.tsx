"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AddRuleButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <Plus size={16} />
      Rule
    </Button>
  )
}
