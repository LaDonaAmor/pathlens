"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QueryTree } from "@/types/query"
import { toolbarLabelClass } from "./ImportButton"

export function ExportButton({
  tree,
  sqlQuery,
  mongoQuery,
  jsonQuery,
}: {
  tree: QueryTree
  sqlQuery: string
  mongoQuery: unknown
  jsonQuery: string
}) {
  function handleExport() {
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      queryTree: tree,
      previews: {
        sql: sqlQuery,
        mongo: mongoQuery,
        json: JSON.parse(jsonQuery),
      },
    }

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
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
      Export
    </Button>
  )
}
