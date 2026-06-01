"use client"

import { FolderPlus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AddGroupButton({ onClick }: { onClick: () => void }) {
  return (
    <Button onClick={onClick}>
      <FolderPlus size={16} />
      Group
    </Button>
  )
}
