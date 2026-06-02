"use client"

import { CopyButton } from "@/components/preview/CopyButton"
import { MongoPreview } from "@/components/preview/MongoPreview"
import { SqlPreview } from "@/components/preview/SqlPreview"
import { Button } from "@/components/ui/button"
import { useUiStore } from "@/store/uiStore"

export function QueryPreview({
  sqlQuery,
  mongoQuery,
  jsonQuery,
}: {
  sqlQuery: string
  mongoQuery: unknown
  jsonQuery: string
}) {
  const mode = useUiStore((state) => state.previewMode)
  const setMode = useUiStore((state) => state.setPreviewMode)

  const copyValue =
    mode === "sql"
      ? sqlQuery
      : mode === "mongo"
        ? JSON.stringify(mongoQuery, null, 2)
        : jsonQuery

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Live Preview</h2>

        <div className="flex flex-wrap gap-2">
          {(["sql", "mongo", "json"] as const).map((item) => (
            <Button
              key={item}
              onClick={() => setMode(item)}
              className={
                mode === item
                  ? "border-(--app-accent) bg-(--app-accent) text-white hover:bg-(--app-accent-hover)"
                  : ""
              }
            >
              {item.toUpperCase()}
            </Button>
          ))}

          <CopyButton value={copyValue} />
        </div>
      </div>

      {mode === "sql" ? (
        <SqlPreview value={sqlQuery} />
      ) : mode === "mongo" ? (
        <MongoPreview value={mongoQuery} />
      ) : (
        <SqlPreview value={jsonQuery} />
      )}
    </section>
  )
}
