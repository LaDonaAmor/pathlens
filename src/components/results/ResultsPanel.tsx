"use client"

import { useMemo, useState } from "react"
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
}: {
  data: DataRecord[]
  tree: QueryTree
}) {
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState<SortState | null>(null)

  const result = useMemo(
    () => executeQuery(data, tree, sort),
    [data, tree, sort]
  )

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

        <ResultsCount
          total={result.total}
          executionTimeMs={result.executionTimeMs}
        />
      </div>

      {rows.length ? (
        <ResultsTable rows={rows} sort={sort} onSortChange={setSort} />
      ) : (
        <EmptyState />
      )}

      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </section>
  )
}
