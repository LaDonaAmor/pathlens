"use client"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QueryTree } from "@/types/query"
import { toolbarLabelClass } from "./ImportButton"

export function ExportButton({ tree }: { tree: QueryTree }) {
  function handleExport() {
    const blob = new Blob([JSON.stringify(tree, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "pathlens-query.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={handleExport} className={toolbarLabelClass}>
      <Download size={16} />
      <span className="max-lg:sr-only">Export</span>
    </Button>
  )
}
