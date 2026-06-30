"use client"

import { CopyButton } from "@/components/preview/CopyButton"
import { MongoPreview } from "@/components/preview/MongoPreview"
import { SqlPreview } from "@/components/preview/SqlPreview"
import { useUiStore } from "@/store/uiStore"
import { Button } from "../ui/button"
import { useQueryBuilder } from "@/hooks/useQueryBuilder"

const LANGUAGE_LABELS: Record<string, string> = {
  sql: "SQL",
  mongo: "Mongo",
  json: "JSON",
  graphql: "GraphQL",
  cypher: "Cypher",
  promql: "PromQL",
  kql: "KQL",
  spl: "SPL",
}

export function QueryPreview() {
  const mode = useUiStore((state) => state.previewMode)
  const setMode = useUiStore((state) => state.setPreviewMode)
  const {
    sqlQuery,
    mongoQuery,
    jsonQuery,
    graphqlQuery,
    cypherQuery,
    promqlQuery,
    kqlQuery,
    splQuery,
  } = useQueryBuilder()

  const queries: Record<string, { value: string; isJson: boolean }> = {
    sql: { value: sqlQuery, isJson: false },
    mongo: { value: JSON.stringify(mongoQuery, null, 2), isJson: true },
    json: { value: jsonQuery, isJson: false },
    graphql: { value: graphqlQuery, isJson: false },
    cypher: { value: cypherQuery, isJson: false },
    promql: { value: promqlQuery, isJson: false },
    kql: { value: kqlQuery, isJson: false },
    spl: { value: splQuery, isJson: false },
  }

  const current = queries[mode]
  const copyValue = current.value

  return (
    <div className="flex flex-col overflow-hidden rounded-md border border-(--app-border-muted)">
      <div className="flex items-center justify-between border-b border-(--app-border-muted) bg-(--syntax-bg) pl-2 pr-1">
        <div className="flex gap-8 overflow-x-auto">
          {Object.keys(LANGUAGE_LABELS).map((lang) => (
            <Button
              key={lang}
              onClick={() => setMode(lang as typeof mode)}
              className={
                mode === lang
                  ? "shrink-0 rounded-none border-0 border-b-2 border-(--app-accent) bg-transparent px-3 py-2 font-(--font-mono) text-xs uppercase tracking-wider text-(--syntax-text) hover:bg-transparent hover:text-(--syntax-text) focus:outline-none focus-visible:outline-none"
                  : "shrink-0 rounded-none border-0 bg-transparent px-3 py-1 font-(--font-mono) text-xs uppercase tracking-wider text-(--syntax-text)/50 transition hover:bg-transparent hover:text-(--syntax-text)/80 focus:outline-none focus-visible:outline-none"
              }
            >
              {LANGUAGE_LABELS[lang]}
            </Button>
          ))}
        </div>
        <CopyButton value={copyValue} />
      </div>

      <div className="min-h-0">
        {mode === "mongo" ? (
          <MongoPreview value={mongoQuery} />
        ) : (
          <SqlPreview
            value={current.value}
            mode={current.isJson ? "json" : "sql"}
          />
        )}
      </div>
    </div>
  )
}
