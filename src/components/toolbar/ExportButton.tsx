"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { exportQuery } from "@/lib/importExport"
import type { QueryTree } from "@/types/query"

export function ExportButton({ tree }: { tree: QueryTree }) {
  function handleExport() {
    const blob = new Blob([exportQuery(tree)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = "pathlens-query.json"
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={handleExport}>
      <Download size={16} />
      Export
    </Button>
  )
}
