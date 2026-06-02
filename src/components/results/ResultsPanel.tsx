"use client"

import { useMemo, useState, useEffect } from "react"
import { executeQuery } from "@/lib/queryExecutor"
import type { QueryTree } from "@/types/query"
import type { DataRecord, SortState } from "@/types/results"
import { EmptyState } from "./EmptyState"
import { Pagination } from "./Pagination"
import { ResultsCount } from "./ResultsCount"
import { ResultsTable } from "./ResultsTable"

export function ResultsPanel({
  data,
  tree,
  stampKey = 0,
}: {
  data: DataRecord[]
  tree: QueryTree
  stampKey?: number
}) {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortState | null>(null)

  const result = useMemo(
    () => executeQuery(data, tree, sort),
    [data, tree, sort]
  )

  const [executionTimeMs, setExecutionTimeMs] = useState(0)

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      const start = performance.now()
      executeQuery(data, tree, sort)
      setExecutionTimeMs(performance.now() - start)
    })

    return () => cancelAnimationFrame(frameId)
  }, [data, tree, sort])

  const pageSize = 10

  const pageCount = useMemo(
    () => Math.ceil(result.rows.length / pageSize),
    [result.rows.length]
  )

  const rows = useMemo(
    () => result.rows.slice((page - 1) * pageSize, page * pageSize),
    [page, result.rows]
  )

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Results</h2>

        <ResultsCount total={result.total} executionTimeMs={executionTimeMs} />
      </div>

      {stampKey > 0 ? (
        <div
          key={stampKey}
          className="animate-execution-stamp inline-flex border-2 border-(--app-accent) bg-(--app-surface) px-3 py-2 font-(--font-mono) text-xs uppercase tracking-[0.14em] text-(--app-accent)"
        >
          Executed · {result.total} rows · {executionTimeMs.toFixed(1)}ms
        </div>
      ) : null}

      {rows.length ? (
        <ResultsTable rows={rows} sort={sort} onSortChange={setSort} />
      ) : (
        <EmptyState />
      )}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </section>
  )
}
