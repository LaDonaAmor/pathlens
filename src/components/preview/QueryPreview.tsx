"use client"

import { CopyButton } from "@/components/preview/CopyButton"
import { MongoPreview } from "@/components/preview/MongoPreview"
import { SqlPreview } from "@/components/preview/SqlPreview"
import { useUiStore } from "@/store/uiStore"
import { Button } from "../ui/button"

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
    <div className="flex flex-col overflow-hidden rounded-md border border-(--app-border-muted)">
      <div className="flex items-center justify-between border-b border-(--app-border-muted) bg-(--syntax-bg) pl-2 pr-1">
        <div className="flex">
          {(["sql", "mongo", "json"] as const).map((item) => (
            <Button
              key={item}
              onClick={() => setMode(item)}
              className={
                mode === item
                  ? "rounded-none border-0 border-b-2 border-(--app-accent) bg-transparent px-4 py-2 font-(--font-mono) text-xs uppercase tracking-wider text-(--syntax-text) hover:bg-transparent hover:text-(--syntax-text) focus:outline-none focus-visible:outline-none"
                  : "rounded-none border-0 bg-transparent px-4 py-2 font-(--font-mono) text-xs uppercase tracking-wider text-(--syntax-text)/50 transition hover:bg-transparent hover:text-(--syntax-text)/80 focus:outline-none focus-visible:outline-none"
              }
            >
              {item}
            </Button>
          ))}
        </div>
        <CopyButton value={copyValue} />
      </div>

      <div className="min-h-0">
        {mode === "sql" ? (
          <SqlPreview value={sqlQuery} mode="sql" />
        ) : mode === "mongo" ? (
          <MongoPreview value={mongoQuery} />
        ) : (
          <SqlPreview value={jsonQuery} mode="json" />
        )}
      </div>
    </div>
  )
}
